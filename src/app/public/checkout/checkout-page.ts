import {
  Component,
  inject,
  signal,
  computed,
  effect,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import { CartService } from '@app/shared/services/cart.service';
import { OrderService } from '@app/features/orders/application/services/order.service';
import {
  PaymentService,
  PaymentTicket,
} from '@app/features/orders/application/services/payment.service';
import { AuthService } from '@app/core/services/auth.service';
import {
  Order,
  OrderItem,
} from '@app/features/orders/domain/entities/order.entity';
import { NotificationService } from '@app/core/services/notification.service';
import { ContactService } from '@app/core/services/contact.service';
import { ProductService } from '@app/public/products/services/product.service';
import { ProfileService } from '@app/core/services/profile.service';
import { BranchService } from '@app/core/services/branch.service';
import {
  ShippingService,
  ShippingQuote,
} from '@app/features/orders/application/services/shipping.service';
import { MercadoPagoService } from '@app/features/orders/application/services/mercadopago.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { firstValueFrom, debounceTime, distinctUntilChanged } from 'rxjs';
import { HydrationPreserveDirective } from '@app/shared/directives/hydration-preserve.directive';

type CheckoutStep =
  | 'form'
  | 'payment_method'
  | 'pending_payment'
  | 'awaiting_verification'
  | 'paid'
  | 'payment_failure'
  | 'payment_pending'
  | 'mp_redirect';
type PaymentMethodChoice = 'digital' | 'cash' | 'credit_card';

type AppliedCoupon = {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
};

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    HydrationPreserveDirective,
  ],
  templateUrl: './checkout-page.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit, OnDestroy {
  // ── Inyecciones ────────────────────────────────────────
  cdr = inject(ChangeDetectorRef, { optional: true });
  cartService = inject(CartService);
  orderService = inject(OrderService);
  paymentService = inject(PaymentService);
  authService = inject(AuthService);
  contactService = inject(ContactService);
  productService = inject(ProductService);
  profileService = inject(ProfileService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  branchService = inject(BranchService);
  shippingService = inject(ShippingService);
  mercadopagoService = inject(MercadoPagoService);

  private platformId = inject(PLATFORM_ID);

  // ── Form ───────────────────────────────────────────────
  checkoutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: this.fb.group({
      street: ['', [Validators.required]],
      number: ['', [Validators.required]],
      city: ['Marcos Paz', [Validators.required]],
      neighborhood: [''],
      postal_code: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{4}$')],
      ],
    }),
    notes: [''],
  });

  // ── UI State ────────────────────────────────────────────
  step = signal<CheckoutStep>('form');
  isProcessing = signal(false);
  selectedMethod = signal<PaymentMethodChoice | null>(null);
  currentOrder = signal<Order | null>(null);
  paymentTicket = signal<PaymentTicket | null>(null);
  proofFile = signal<File | null>(null);
  proofPreviewUrl = signal<string | null>(null);
  shippingQuote = signal<ShippingQuote | null>(null);
  isCalculatingShipping = signal<boolean>(false);
  mpPaymentUrl = signal<string | null>(null);
  mpPaymentId = signal<string | null>(null);
  mpStatus = signal<string | null>(null);
  mpOrderId = signal<string | null>(null);

  // Cross-selling
  recommendedProducts = signal<Product[]>([]);

  // ── Points ─────────────────────────────────────────────
  availablePoints = signal<number>(0);
  usePoints = signal<boolean>(false);
  pointsDiscountValue = computed(() => {
    if (this.usePoints()) {
      const maxDiscount = this.cartService.totalPrice();
      return Math.min(this.availablePoints(), maxDiscount);
    }
    return 0;
  });

  // ── Coupon ─────────────────────────────────────────────
  // TODO: mover a CouponService con validación server-side.
  private readonly DEMO_COUPONS: Record<
    string,
    { type: 'percent' | 'fixed'; value: number }
  > = {
      DESCUENTO10: { type: 'percent', value: 10 },
      BIENVENIDO: { type: 'fixed', value: 500 },
    };
  appliedCoupon = signal<AppliedCoupon | null>(null);
  couponDiscount = computed(() => {
    const c = this.appliedCoupon();
    if (!c) return 0;
    const base = this.cartService.totalPrice();
    const amount =
      c.type === 'percent' ? base * (c.value / 100) : c.value;
    return Math.max(0, Math.min(amount, base));
  });

  // ── Total mostrado en UI (nunca negativo) ─────────────
  displayTotal = computed(() =>
    Math.max(
      0,
      this.cartService.totalPrice() +
      (this.shippingQuote()?.cost ?? 0) -
      this.couponDiscount() -
      this.pointsDiscountValue(),
    ),
  );

  // ── Reservation countdown (15 min = 900 s) ─────────────
  reservationSeconds = signal(900);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;
  countdownExpired = computed(() => this.reservationSeconds() <= 0);

  countdownDisplay = computed(() => {
    const s = this.reservationSeconds();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  countdownPct = computed(() => (this.reservationSeconds() / 900) * 100);

  // ── Barcode estático (no se recrea en cada CD) ────────
  readonly barcodeBars = Array.from({ length: 30 }, (_, i) => i + 1);

  // ── Expose signals del PaymentService ──────────────────
  orderStatus = computed(() => this.paymentService.orderStatus());
  isUploadingProof = computed(() => this.paymentService.isUploadingProof());

  // ── Foco entre steps (a11y) ────────────────────────────
  stepHeading = viewChild<ElementRef<HTMLElement>>('stepHeading');

  constructor() {
    effect(() => {
      // track sólo `step()`; el heading se resuelve después del render
      const _step = this.step();
      queueMicrotask(() => this.stepHeading()?.nativeElement.focus());
    });
  }

  // ─────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────
  ngOnInit(): void {
    // Mercado Pago return query params
    this.route.queryParams.subscribe((params) => {
      const status = params['status'] || params['collection_status'];
      const paymentId = params['payment_id'] || params['collection_id'];
      const orderId = params['external_reference'] || params['order_id'];

      if (status) {
        this.mpPaymentId.set(paymentId ? String(paymentId) : null);
        this.mpStatus.set(String(status));
        this.mpOrderId.set(orderId ? String(orderId) : null);

        if (status === 'approved') {
          this.cartService.clearCart();
          this.step.set('paid');
          this.notificationService.showSuccess(
            '¡Pago confirmado con éxito por Mercado Pago!',
          );
        } else if (
          status === 'rejected' ||
          status === 'failure' ||
          status === 'cancelled'
        ) {
          this.step.set('payment_failure');
          this.notificationService.showError(
            'El pago fue rechazado o cancelado.',
          );
        } else if (status === 'pending' || status === 'in_process') {
          this.cartService.clearCart();
          this.step.set('payment_pending');
          this.notificationService.showInfo(
            'Tu pago está pendiente de acreditación.',
          );
        }
      }
    });

    // Pre-fill si el usuario está logueado
    const user = this.authService.getCurrentUser();
    if (user?.email) {
      this.checkoutForm.patchValue({ email: user.email });
      this.profileService.getProfile(user.id).then((profile) => {
        if (profile?.points) this.availablePoints.set(profile.points);
      });
    }

    // Shipping por CP
    this.checkoutForm
      .get('address.postal_code')
      ?.valueChanges.pipe(debounceTime(800), distinctUntilChanged())
      .subscribe((cp) => {
        if (cp && cp.length === 4) this.calculateShipping(cp);
        else this.shippingQuote.set(null);
      });

    const initialCp = this.checkoutForm.get('address.postal_code')?.value;
    if (initialCp && initialCp.length === 4) this.calculateShipping(initialCp);

    // Cross-selling
    this.productService.getData({ _page: 1 }).subscribe((res) => {
      const inCartIds = this.cartService.cartItems().map((i) => i.product.id);
      const suggestions = (res.data || [])
        .filter((p) => !inCartIds.includes(p.id))
        .slice(0, 3);
      this.recommendedProducts.set(suggestions as unknown as Product[]);
    });
  }

  ngOnDestroy(): void {
    this._stopCountdown();
    this.paymentService.stopPolling();
  }

  // ─────────────────────────────────────────────────────────
  // Helpers de template
  // ─────────────────────────────────────────────────────────

  showError(path: string): boolean {
    const ctrl = this.checkoutForm.get(path);
    return !!ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty);
  }

  async copyToClipboard(
    text: string,
    btn: EventTarget | null,
  ): Promise<void> {
    const el = btn as HTMLElement | null;
    if (!el) return;
    try {
      await navigator.clipboard.writeText(text);
      const prev = el.innerHTML;
      el.innerHTML = '<i class="fas fa-check"></i> Copiado';
      setTimeout(() => (el.innerHTML = prev), 1500);
    } catch {
      // Fallback para navegadores sin Clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    }
  }

  // ─────────────────────────────────────────────────────────
  // Navegación entre steps
  // ─────────────────────────────────────────────────────────

  goBackToForm(): void {
    this.selectedMethod.set(null);
    this._stopCountdown();
    this.step.set('form');
  }

  retryPayment(): void {
    this.selectedMethod.set(null);
    this.step.set('payment_method');
    // sólo reiniciamos el countdown si ya expiró
    if (this.countdownExpired()) this._startCountdown();
    this.cdr?.detectChanges();
  }

  async goToPaymentMethod(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.showError(
        'Por favor, completá todos los campos requeridos.',
      );
      return;
    }
    if (this.cartService.cartItems().length === 0) {
      this.notificationService.showError('Tu carrito está vacío.');
      return;
    }
    this.step.set('payment_method');
    this._startCountdown();
  }

  // ─────────────────────────────────────────────────────────
  // Puntos y cupón
  // ─────────────────────────────────────────────────────────

  toggleUsePoints(): void {
    if (this.availablePoints() > 0) {
      this.usePoints.set(!this.usePoints());
    }
  }

  applyCoupon(code: string): void {
    const trimmed = (code || '').trim().toUpperCase();
    if (!trimmed) return;

    const def = this.DEMO_COUPONS[trimmed];
    if (!def) {
      this.appliedCoupon.set(null);
      this.notificationService.showError('Cupón inválido o expirado.');
      return;
    }
    this.appliedCoupon.set({ code: trimmed, ...def });
    this.notificationService.showSuccess(`Cupón "${trimmed}" aplicado.`);
  }

  // ─────────────────────────────────────────────────────────
  // Selección de método
  // ─────────────────────────────────────────────────────────

  selectMethod(method: PaymentMethodChoice): void {
    this.selectedMethod.set(method);
  }

  // ─────────────────────────────────────────────────────────
  // Cross-selling (compatibilidad con templates viejos)
  // ─────────────────────────────────────────────────────────

  addRecommendedToCart(product: Product) {
    this.cartService.addToCart(product);
    this.notificationService.showSuccess(`${product.name} agregado al pedido.`);
    this.recommendedProducts.update((list) =>
      list.filter((p) => p.id !== product.id),
    );
  }

  // ─────────────────────────────────────────────────────────
  // Shipping
  // ─────────────────────────────────────────────────────────

  private calculateShipping(cp: string) {
    this.isCalculatingShipping.set(true);
    const cartTotal = this.cartService.totalPrice();
    this.shippingService.calculateShipping(cp, cartTotal).subscribe({
      next: (quote) => {
        this.shippingQuote.set(quote);
        this.isCalculatingShipping.set(false);
      },
      error: () => {
        this.shippingQuote.set(null);
        this.isCalculatingShipping.set(false);
      },
    });
  }

  // ─────────────────────────────────────────────────────────
  // Crear orden + derivar al flujo de pago elegido
  // ─────────────────────────────────────────────────────────

  async placeOrder(): Promise<void> {
    if (this.isProcessing()) return;

    const method = this.selectedMethod();
    if (!method) {
      this.notificationService.showError(
        'Elegí un método de pago para continuar.',
      );
      return;
    }

    if (this.countdownExpired()) {
      this.notificationService.showError(
        'La reserva expiró. Volvé al formulario para renovarla.',
      );
      return;
    }

    const cartItems = this.cartService.cartItems();
    if (!cartItems || cartItems.length === 0) {
      this.notificationService.showError('Tu carrito está vacío.');
      return;
    }

    // Validación atómica de stock
    for (const item of cartItems) {
      if (
        item.product.stock !== undefined &&
        item.product.stock !== null &&
        item.product.stock < item.quantity
      ) {
        this.notificationService.showError(
          `Stock insuficiente para "${item.product.name}". Disponible: ${item.product.stock}, solicitado: ${item.quantity}`,
        );
        return;
      }
    }

    this.isProcessing.set(true);

    const formVal = this.checkoutForm.getRawValue();
    const subtotal = this.cartService.totalPrice();
    const shippingCost = this.shippingQuote()?.cost || 0;

    // Descuentos SEPARADOS (cupón no toca puntos del perfil)
    const pointsDiscount = this.pointsDiscountValue();
    const couponDiscount = this.couponDiscount();
    const totalDiscount = pointsDiscount + couponDiscount;
    const total = Math.max(0, subtotal + shippingCost - totalDiscount);

    const addressStr = `${formVal.address.street} ${formVal.address.number}, ${formVal.address.neighborhood
        ? formVal.address.neighborhood + ', '
        : ''
      }${formVal.address.city} (CP: ${formVal.address.postal_code})`;

    const currentUser = this.authService.getCurrentUser();
    let guestSessionId: string | undefined;
    if (!currentUser && isPlatformBrowser(this.platformId)) {
      guestSessionId =
        localStorage.getItem('cart_session_id') || undefined;
    }

    const order: Order = {
      customer_name: formVal.name,
      customer_email: formVal.email,
      customer_phone: formVal.phone,
      shipping_address: formVal.address,
      status: 'pending_payment',
      subtotal,
      tax: 0,
      discount: totalDiscount,
      total,
      total_amount: total,
      payment_method: method,
      notes: formVal.notes,
      user_id: currentUser?.id,
      session_id: guestSessionId,
      branch_id: this.branchService.getCurrentBranchId() || undefined,
    };

    const orderItems: OrderItem[] = cartItems.map((item) => {
      const finalPrice = item.product.convertedPrice || item.product.price;
      return {
        cart_item_id: item.cartItemId,
        product_name: item.product.name,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: finalPrice,
        subtotal: finalPrice * item.quantity,
      };
    });

    try {
      order.items = orderItems;
      const created = await firstValueFrom(
        this.orderService.createOrder(order),
      );
      if (!created) throw new Error('No se pudo crear la orden.');

      this.currentOrder.set(created);
      this.paymentService.orderStatus.set('pending_payment');

      // Mensaje de contacto (no bloqueante)
      const itemsList = cartItems
        .map((i) => {
          const p = i.product.convertedPrice || i.product.price;
          return `- ${i.product.name} (x${i.quantity}) - $${(p * i.quantity).toFixed(2)}`;
        })
        .join('\n');

      const methodLabel =
        method === 'digital'
          ? 'Pago Digital'
          : method === 'credit_card'
            ? 'Mercado Pago'
            : 'Efectivo (Rapipago/PagoFácil)';

      this.contactService
        .createMessage({
          name: formVal.name,
          email: formVal.email,
          phone: formVal.phone,
          subject: `[RESERVA STOCK] #${created.order_number} - ${formVal.name} - $${total.toFixed(2)}`,
          message:
            `Reserva de Stock #${created.order_number}\n\n` +
            `Cliente: ${formVal.name}\n` +
            `Email: ${formVal.email}\n` +
            `Teléfono: ${formVal.phone}\n` +
            `Dirección: ${addressStr}\n` +
            `Logística: ${this.shippingQuote()?.provider || 'Retiro'}\n` +
            `Costo Envío: $${shippingCost}\n\n` +
            `Productos:\n${itemsList}\n\n` +
            `Descuento cupón: $${couponDiscount.toFixed(2)}\n` +
            `Descuento puntos: $${pointsDiscount.toFixed(2)}\n` +
            `Total: $${total.toFixed(2)}\n\n` +
            `Método: ${methodLabel}\n\n` +
            `Notas: ${formVal.notes || 'Ninguna'}`,
        })
        .catch((e: unknown) =>
          console.warn('Contact message error (non-fatal):', e),
        );

      if (method === 'cash') {
        const ticket = this.paymentService.buildPaymentTicket(
          created.id!,
          created.order_number!,
          total,
        );
        this.paymentTicket.set(ticket);
        this.step.set('pending_payment');
      } else if (method === 'credit_card') {
        // MERCADO PAGO INTEGRATION
        const intent = await firstValueFrom(
          this.mercadopagoService.createPreference(
            created.id!,
            orderItems,
            shippingCost,
            formVal.name,
          ),
        );
        this.mpPaymentUrl.set(intent.init_point);
        this.step.set('mp_redirect');
      } else {
        // Digital: instrucciones externas
        this.step.set('pending_payment');
      }

      // Limpieza del carrito (UNA sola vez, después de crear la orden)
      this.cartService.clearCart();

      // Polling de confirmación (cada 20s)
      this.paymentService.startPolling(created.id!, 20000);

      // Descontar SÓLO puntos del perfil (cupón no toca puntos)
      if (pointsDiscount > 0 && order.user_id) {
        const remainingPoints = Math.max(
          0,
          this.availablePoints() - pointsDiscount,
        );
        try {
          await this.authService.updateUserProfile(order.user_id, {
            points: remainingPoints,
          });
          this.availablePoints.set(remainingPoints);
          this.usePoints.set(false);
        } catch (e) {
          console.warn('Could not deduct points from profile', e);
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);

      let errorMsg = error?.message || 'Error desconocido';
      if (errorMsg.includes('permisos') || error?.code === '42501') {
        errorMsg =
          'No tienes permisos para crear la orden. Asegúrate de que tu sesión sea válida o contacta a soporte si el problema persiste.';
      }
      this.notificationService.showError(
        `Error al procesar tu reserva: ${errorMsg}`,
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  // ─────────────────────────────────────────────────────────
  // Comprobante
  // ─────────────────────────────────────────────────────────

  onProofFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      this.notificationService.showError(
        'Solo se aceptan imágenes o PDF como comprobante.',
      );
      return;
    }

    this.proofFile.set(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) =>
        this.proofPreviewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      this.proofPreviewUrl.set(null);
    }
  }

  async submitProof(): Promise<void> {
    const file = this.proofFile();
    const order = this.currentOrder();
    if (!file || !order?.id) {
      this.notificationService.showError(
        'Seleccioná el archivo del comprobante.',
      );
      return;
    }

    try {
      await this.paymentService.uploadPaymentProof(order.id, file);
      this.notificationService.showSuccess(
        'Comprobante enviado. ¡Te avisamos cuando lo validemos!',
      );
      this.step.set('awaiting_verification');
    } catch (err: any) {
      const errorObj = err as { message?: string };
      this.notificationService.showError(
        `No se pudo enviar el comprobante: ${errorObj?.message || 'Error desconocido'}`,
      );
    }
  }

  // ─────────────────────────────────────────────────────────
  // Helpers de formato y WhatsApp
  // ─────────────────────────────────────────────────────────

  formatTicketCode(code: string): string {
    return code.replace(/(.{4})/g, '$1 ').trim();
  }

  get whatsappNumber(): string {
    return (
      this.branchService.currentBranch()?.whatsapp_number || '+5491125960900'
    )
      .replace(/\s/g, '')
      .replace('+', '');
  }

  get whatsappUrl(): string {
    const order = this.currentOrder();
    const name = this.checkoutForm.get('name')?.value || '';
    const branch = this.branchService.currentBranch()?.name || 'Arecofix';
    const num = order?.order_number || '';
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      `Hola, completé el pago de mi pedido #${num} en ${branch}. Mi nombre es ${name}. Adjunto comprobante.`,
    )}`;
  }

  // ─────────────────────────────────────────────────────────
  // Countdown interno
  // ─────────────────────────────────────────────────────────

  private _startCountdown(): void {
    this._stopCountdown();
    this.reservationSeconds.set(900);
    if (isPlatformBrowser(this.platformId)) {
      this.countdownInterval = setInterval(() => {
        const current = this.reservationSeconds();
        if (current > 0) {
          this.reservationSeconds.set(current - 1);
        } else {
          this._stopCountdown();
        }
      }, 1000);
    }
  }

  private _stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}