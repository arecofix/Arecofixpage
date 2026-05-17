import {
  Component,
  inject,
  signal,
  computed,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CartService } from '@app/shared/services/cart.service';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { PaymentService, PaymentTicket } from '@app/features/orders/application/services/payment.service';
import { AuthService } from '@app/core/services/auth.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { NotificationService } from '@app/core/services/notification.service';
import { ContactService } from '@app/core/services/contact.service';
import { ProductService } from '@app/public/products/services/product.service';
import { ProfileService } from '@app/core/services/profile.service';
import { BranchService } from '@app/core/services/branch.service';
import { ShippingService, ShippingQuote } from '@app/features/orders/application/services/shipping.service';
import { GetnetService } from '@app/features/orders/application/services/getnet.service';
import { Product } from '@app/features/products/domain/entities/product.entity';
import { firstValueFrom, debounceTime, distinctUntilChanged } from 'rxjs';

type CheckoutStep = 'form' | 'payment_method' | 'pending_payment' | 'awaiting_verification' | 'paid' | 'getnet_redirect';
type PaymentMethodChoice = 'digital' | 'cash' | 'credit_card';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit, OnDestroy {
  cartService     = inject(CartService);
  orderService    = inject(OrderService);
  paymentService  = inject(PaymentService);
  authService     = inject(AuthService);
  contactService  = inject(ContactService);
  productService  = inject(ProductService);
  profileService  = inject(ProfileService);
  fb              = inject(FormBuilder);
  router          = inject(Router);
  notificationService = inject(NotificationService);
  branchService   = inject(BranchService);
  shippingService = inject(ShippingService);
  getnetService   = inject(GetnetService);

  // ── Form ───────────────────────────────────────────────
  checkoutForm: FormGroup = this.fb.group({
    name:  ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    address: this.fb.group({
      street:       ['', [Validators.required]],
      number:       ['', [Validators.required]],
      city:         ['Marcos Paz', [Validators.required]],
      neighborhood: [''],
      postal_code:  ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    }),
    notes: [''],
  });

  // ── UI State ────────────────────────────────────────────
  step               = signal<CheckoutStep>('form');
  isProcessing       = signal(false);
  selectedMethod     = signal<PaymentMethodChoice | null>(null);
  currentOrder       = signal<Order | null>(null);
  paymentTicket      = signal<PaymentTicket | null>(null);
  proofFile          = signal<File | null>(null);
  proofPreviewUrl    = signal<string | null>(null);
  shippingQuote      = signal<ShippingQuote | null>(null);
  isCalculatingShipping = signal<boolean>(false);
  getnetPaymentUrl   = signal<string | null>(null);
  
  // Cross-selling
  recommendedProducts = signal<Product[]>([]);

  // ── Reservation countdown (15 min = 900 s) ─────────────
  reservationSeconds = signal(900);
  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  countdownDisplay = computed(() => {
    const s = this.reservationSeconds();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  });

  countdownPct = computed(() => (this.reservationSeconds() / 900) * 100);

  // expose payment service signals directly to template
  orderStatus       = computed(() => this.paymentService.orderStatus());
  isUploadingProof  = computed(() => this.paymentService.isUploadingProof());

  ngOnInit(): void {
    // Pre-fill form if user is logged in
    const user = this.authService.getCurrentUser();
    if (user?.email) {
      this.checkoutForm.patchValue({ email: user.email });
    }

    // Subscribe to postal code changes to calculate shipping
    this.checkoutForm.get('address.postal_code')?.valueChanges.pipe(
      debounceTime(800),
      distinctUntilChanged()
    ).subscribe(cp => {
      if (cp && cp.length === 4) {
        this.calculateShipping(cp);
      } else {
        this.shippingQuote.set(null);
      }
    });

    // Check initial value if exists
    const initialCp = this.checkoutForm.get('address.postal_code')?.value;
    if (initialCp && initialCp.length === 4) {
      this.calculateShipping(initialCp);
    }

    // Load cross-selling items
    this.productService.getData({ _page: 1 }).subscribe(res => {
      // Filter out items already in the cart
      const inCartIds = this.cartService.cartItems().map(i => i.product.id);
      const suggestions = (res.data || []).filter(p => !inCartIds.includes(p.id)).slice(0, 3);
      this.recommendedProducts.set(suggestions as any);
    });
  }

  addRecommendedToCart(product: Product) {
    this.cartService.addToCart(product);
    this.notificationService.showSuccess(`${product.name} agregado al pedido.`);
    // Remove from suggestions
    this.recommendedProducts.update(list => list.filter(p => p.id !== product.id));
  }

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
      }
    });
  }

  ngOnDestroy(): void {
    this._stopCountdown();
    this.paymentService.stopPolling();
  }

  // ── Step: submit form → goto payment method selection ─
  async goToPaymentMethod(): Promise<void> {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.showError('Por favor, completá todos los campos requeridos.');
      return;
    }
    if (this.cartService.cartItems().length === 0) {
      this.notificationService.showError('Tu carrito está vacío.');
      return;
    }
    this.step.set('payment_method');
    this._startCountdown();
  }

  selectMethod(method: PaymentMethodChoice): void {
    this.selectedMethod.set(method);
  }

  // ── Step: create PENDING_PAYMENT order in Supabase ─────
  async placeOrder(): Promise<void> {
    const method = this.selectedMethod();
    if (!method) {
      this.notificationService.showError('Elegí un método de pago para continuar.');
      return;
    }

    this.isProcessing.set(true);

    const formVal    = this.checkoutForm.getRawValue();
    const cartItems  = this.cartService.cartItems();
    const subtotal   = this.cartService.totalPrice();
    const shippingCost = this.shippingQuote()?.cost || 0;
    const total      = subtotal + shippingCost;

    const addressStr = `${formVal.address.street} ${formVal.address.number}, ${formVal.address.neighborhood ? formVal.address.neighborhood + ', ' : ''}${formVal.address.city} (CP: ${formVal.address.postal_code})`;

    const order: Order = {
      customer_name:    formVal.name,
      customer_email:   formVal.email,
      customer_phone:   formVal.phone,
      shipping_address: formVal.address,
      status:           'pending_payment',
      subtotal:         subtotal,
      tax:              0,
      discount:         0,
      total,
      total_amount:     total,
      payment_method:   method,
      notes:            formVal.notes,
      user_id:          this.authService.getCurrentUser()?.id,
      branch_id:        this.branchService.getCurrentBranchId() || undefined,
    };

    const orderItems: OrderItem[] = cartItems.map((item) => ({
      product_name: item.product.name,
      product_id:   item.product.id,
      quantity:     item.quantity,
      unit_price:   item.product.price,
      subtotal:     item.product.price * item.quantity,
    }));

    try {
      order.items = orderItems;
      const created = await firstValueFrom(this.orderService.createOrder(order));

      if (!created) throw new Error('No se pudo crear la orden.');

      this.currentOrder.set(created);
      this.paymentService.orderStatus.set('pending_payment');

      // Save contact message (non-fatal)
      const itemsList = cartItems
        .map((i) => `- ${i.product.name} (x${i.quantity}) - $${(i.product.price * i.quantity).toFixed(2)}`)
        .join('\n');

      this.contactService.createMessage({
        name:    formVal.name,
        email:   formVal.email,
        phone:   formVal.phone,
        subject: `[RESERVA STOCK] #${created.order_number} - ${formVal.name} - $${total.toFixed(2)}`,
        message: `Reserva de Stock #${created.order_number}\n\nCliente: ${formVal.name}\nEmail: ${formVal.email}\nTeléfono: ${formVal.phone}\nDirección: ${addressStr}\nLogística: ${this.shippingQuote()?.provider || 'Retiro'}\nCosto Envío: $${shippingCost}\n\nProductos:\n${itemsList}\n\nTotal: $${total.toFixed(2)}\n\nMétodo: ${method === 'digital' ? 'Pago Digital' : (method === 'credit_card' ? 'Tarjeta (Getnet)' : 'Efectivo (Rapipago/PagoFácil)')}\n\nNotas: ${formVal.notes || 'Ninguna'}`,
      }).catch((e: any) => console.warn('Contact message error (non-fatal):', e));

      if (method === 'cash') {
        const ticket = this.paymentService.buildPaymentTicket(
          created.id!,
          created.order_number!,
          total
        );
        this.paymentTicket.set(ticket);
        this.step.set('pending_payment');
      } else if (method === 'credit_card') {
        // GETNET INTEGRATION
        const intent = await firstValueFrom(this.getnetService.createPaymentIntent(created.id!, total, formVal.name));
        this.getnetPaymentUrl.set(intent.paymentUrl);
        this.step.set('getnet_redirect');
      } else {
        // Digital: show instructions to complete payment externally
        this.step.set('pending_payment');
      }

      this.cartService.clearCart();

      // Start polling for payment confirmation (every 20s)
      this.paymentService.startPolling(created.id!, 20000);

    } catch (error: any) {
      console.error('Checkout error:', error);
      this.notificationService.showError(
        `Error al procesar tu reserva: ${error?.message || 'Error desconocido'}`
      );
    } finally {
      this.isProcessing.set(false);
    }
  }

  // ── Proof upload ────────────────────────────────────────
  onProofFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (!file) return;

    // Only images/pdf
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      this.notificationService.showError('Solo se aceptan imágenes o PDF como comprobante.');
      return;
    }

    this.proofFile.set(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => this.proofPreviewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      this.proofPreviewUrl.set(null);
    }
  }

  async submitProof(): Promise<void> {
    const file  = this.proofFile();
    const order = this.currentOrder();
    if (!file || !order?.id) {
      this.notificationService.showError('Seleccioná el archivo del comprobante.');
      return;
    }

    try {
      await this.paymentService.uploadPaymentProof(order.id, file);
      this.notificationService.showSuccess('Comprobante enviado. ¡Te avisamos cuando lo validemos!');
      this.step.set('awaiting_verification');
    } catch (err: any) {
      this.notificationService.showError(`No se pudo enviar el comprobante: ${err?.message}`);
    }
  }

  // ── Helpers ─────────────────────────────────────────────
  formatTicketCode(code: string): string {
    // Format in groups of 4 for readability: AFXX XXXX XXXX XXXX
    return code.replace(/(.{4})/g, '$1 ').trim();
  }

  get whatsappNumber(): string {
    return (this.branchService.currentBranch()?.whatsapp_number || '+5491125960900')
      .replace(/\s/g, '')
      .replace('+', '');
  }

  get whatsappUrl(): string {
    const order  = this.currentOrder();
    const name   = this.checkoutForm.get('name')?.value || '';
    const branch = this.branchService.currentBranch()?.name || 'Arecofix';
    const num    = order?.order_number || '';
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(
      `Hola, completé el pago de mi pedido #${num} en ${branch}. Mi nombre es ${name}. Adjunto comprobante.`
    )}`;
  }

  private _startCountdown(): void {
    this._stopCountdown();
    this.reservationSeconds.set(900);
    this.countdownInterval = setInterval(() => {
      const current = this.reservationSeconds();
      if (current > 0) {
        this.reservationSeconds.set(current - 1);
      } else {
        this._stopCountdown();
      }
    }, 1000);
  }

  private _stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
