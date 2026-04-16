import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { OrderService } from '@app/features/orders/application/services/order.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { AuthService } from '@app/core/services/auth.service';

import { OrderNotificationService } from '@app/features/orders/services/order-notification.service'; // Import Ecommerce Notification service
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';
import { CustomerService } from '@app/features/customers/application/services/customer.service';
import { PricingService } from '@app/core/services/pricing.service';
import { OrderWorkflowService } from '@app/features/orders/application/services/order-workflow.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ProductOption {
    id: string;
    name: string;
    sku: string;
    price: number;
    unit_cost_at_time: number;
    stock: number;
}

@Component({
    selector: 'app-admin-order-form-page',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, CurrencyPipe, DecimalPipe],
    templateUrl: './admin-order-form-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private customerService = inject(CustomerService);
    private productRepository = inject(ProductRepository);
    private notificationService = inject(OrderNotificationService);
    private pricingService = inject(PricingService);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);
    private workflowService = inject(OrderWorkflowService);
    private destroyRef = inject(DestroyRef);

    orderForm!: FormGroup;


    id: string | null = null;
    loading = true;
    saving = false;
    error: string | null = null;
    private originalStatus: string | null = null; // Store original status


    products: ProductOption[] = [];
    clients: any[] = [];

    // Product autocomplete state
    // Product autocomplete state
    productSearchQueries = signal<string[]>([]);
    showProductDropdowns = signal<boolean[]>([]);

    private setupForm() {
        this.orderForm = this.fb.group({
            customer_name: ['', [Validators.required]],
            customer_email: ['', [Validators.email]],
            customer_phone: ['', [Validators.required]],
            shipping_address: this.fb.group({
                street: ['', [Validators.required]],
                number: ['', [Validators.required]],
                city: ['Marcos Paz', [Validators.required]],
                neighborhood: ['']
            }),
            status: ['pending'],
            subtotal: [0],
            tax: [0],
            discount: [0],
            total: [0],
            payment_method: ['efectivo'],
            notes: [''],
            items: this.fb.array([])
        });

        // Listen for value changes to recalculate totals
        this.orderForm.get('items')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateTotals());
        this.orderForm.get('discount')?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateTotals());
    }

    get items() {
        return this.orderForm.get('items') as FormArray;
    }

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');
        this.setupForm();

        // Parallel initial loading
        await Promise.all([
            this.loadProducts(),
            this.loadClients(),
            this.id ? this.loadOrder() : Promise.resolve()
        ]);

        this.loading = false;
        this.cdr.markForCheck();
    }

    async loadClients() {
        try {
            const data = await this.customerService.getRecentClients(50);
            
            if (data) {
                this.clients = data.map((c: any) => ({
                    ...c,
                    displayName: c.full_name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || c.email
                }));
            }
        } catch (e) {
            console.error('Error loading clients', e);
        }
    }

    onSelectClient(clientName: string) {
        const client = this.clients.find(c => c.displayName === clientName);
        if (client) {
            this.orderForm.patchValue({
                customer_name: client.displayName,
                customer_email: client.email,
                customer_phone: client.phone,
                shipping_address: typeof client.address === 'string' ? { street: client.address } : (client.address || {})
            });
        } else {
            this.orderForm.patchValue({ customer_name: clientName });
        }
    }

    async loadProducts() {
        return new Promise<void>((resolve) => {
            this.productRepository.findAvailable().subscribe({
                next: (products: any[]) => {
                    this.products = products.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        sku: p.sku || '',
                        price: p.price,
                        unit_cost_at_time: p.unit_cost_at_time || 0,
                        stock: p.stock || 0
                    }));
                    resolve();
                },
                error: (err: any) => {
                    console.error('Error loading products', err);
                    resolve();
                }
            });
        });
    }

    async loadOrder() {
        if (!this.id) return;

        this.orderService.getOrderById(this.id).subscribe({
            next: (order: Order | null) => {
                if (!order) return;
                let address = order.shipping_address;
                if (typeof address === 'string') {
                    address = {
                        street: address,
                        number: '',
                        city: 'Marcos Paz',
                        neighborhood: ''
                    };
                }

                this.orderForm.patchValue({
                    customer_name: order.customer_name,
                    customer_email: order.customer_email,
                    customer_phone: order.customer_phone,
                    shipping_address: address || { street: '', number: '', city: '', neighborhood: '' },
                    status: order.status,
                    subtotal: order.subtotal,
                    tax: order.tax,
                    discount: order.discount,
                    total: order.total,
                    payment_method: order.payment_method || 'efectivo',
                    notes: order.notes
                });

                // Clear and repopulate items
                this.items.clear();
                (order.items || []).forEach(item => {
                    this.items.push(this.createItemFormGroup(item));
                });

                this.originalStatus = order.status; // Capture original status
                this.cdr.markForCheck();

            },
            error: (err: any) => {
                this.error = err.message || 'Error desconocido'; // Default message
                this.cdr.markForCheck();
            }
        });
    }

    createItemFormGroup(item?: OrderItem) {
        return this.fb.group({
            product_id: [item?.product_id || null],
            product_name: [item?.product_name || '', [Validators.required]],
            product_sku: [item?.product_sku || ''],
            quantity: [item?.quantity || 1, [Validators.required, Validators.min(1)]],
            unit_price: [item?.unit_price || 0, [Validators.required, Validators.min(0)]],
            unit_cost_at_time: [item?.unit_cost_at_time || 0],
            subtotal: [item?.subtotal || 0]
        });
    }

    addItem() {
        this.items.push(this.createItemFormGroup());
        this.cdr.markForCheck();
    }

    removeItem(index: number) {
        this.items.removeAt(index);
        this.calculateTotals();
    }

    onSearchProduct(index: number, nameQuery: string) {
        const product = this.products.find(p => p.name === nameQuery);
        const itemGroup = this.items.at(index) as FormGroup;

        if (product) {
            itemGroup.patchValue({
                product_id: product.id,
                product_name: product.name,
                product_sku: product.sku,
                unit_price: product.price,
                unit_cost_at_time: product.unit_cost_at_time,
                subtotal: product.price * itemGroup.get('quantity')?.value
            });
        } else {
            itemGroup.patchValue({
                product_id: undefined,
                product_name: nameQuery,
                product_sku: undefined
            });
        }
        this.calculateTotals();
    }

    onUnitPriceChange(index: number) {
        const item = this.items.at(index);
        item.get('subtotal')?.setValue(item.get('unit_price')?.value * item.get('quantity')?.value);
        this.calculateTotals();
    }

    onQuantityChange(index: number) {
        const item = this.items.at(index);
        item.get('subtotal')?.setValue(item.get('unit_price')?.value * item.get('quantity')?.value);
        this.calculateTotals();
    }

    calculateTotals() {
        const items = this.items.value as OrderItem[];
        const subtotal = items.reduce((sum, item) => sum + (Number(item.subtotal) || 0), 0);
        const discount = Number(this.orderForm.get('discount')?.value) || 0;
        
        const taxableAmount = Math.max(0, subtotal - discount);
        const tax = this.pricingService.calculateTaxAmount(taxableAmount);
        const total = this.pricingService.calculateFinalPrice(taxableAmount);

        this.orderForm.patchValue({
            subtotal,
            tax,
            total
        }, { emitEvent: false }); // Avoid infinite loop

        this.cdr.markForCheck();
    }

    updateStatus(newStatus: Order['status']) {
        this.orderForm.get('status')?.setValue(newStatus);
        this.cdr.markForCheck();
    }

    async save() {
        if (this.orderForm.invalid) {
            this.orderForm.markAllAsTouched();
            this.error = 'Por favor, completa los campos requeridos correctamente.';
            this.cdr.markForCheck();
            return;
        }

        if (this.items.length === 0) {
            this.error = 'Debes agregar al menos un producto';
            this.cdr.markForCheck();
            return;
        }

        this.saving = true;
        this.error = null;

        try {
            const orderToSave = this.orderForm.getRawValue();
            let result;
            
            if (this.id) {
                result = await firstValueFrom(this.orderService.updateOrder(this.id, orderToSave));
            } else {
                result = await this.workflowService.processCheckout(orderToSave);
            }

            // Check for status change and notify
            if (this.id && this.originalStatus && orderToSave.status !== this.originalStatus) {
                const productDetails = (orderToSave.items as OrderItem[]).map(item => `${item.quantity}x ${item.product_name}`).join(', ');

                const link = this.notificationService.generateWhatsAppLink(
                    orderToSave.customer_phone || '',
                    orderToSave.customer_name,
                    orderToSave.status,
                    result?.order_number || this.id.substring(0, 8).toUpperCase(), 
                    productDetails
                );

                if (link) {
                    window.open(link, '_blank');
                }
            }

            this.router.navigate(['/admin/orders']);
            
        } catch (e: any) {
            console.error('💥 Save method error:', e);
            this.error = e.message || 'Error al guardar pedido';
            this.saving = false;
            this.cdr.markForCheck();
        }
    }

    // Product autocomplete methods
    onProductInput(index: number, query: string) {
        const queries = [...this.productSearchQueries()];
        queries[index] = query.toLowerCase();
        this.productSearchQueries.set(queries);
    }

    onProductFocus(index: number) {
        const dropdowns = [...this.showProductDropdowns()];
        dropdowns[index] = true;
        this.showProductDropdowns.set(dropdowns);
    }

    onProductBlur(index: number) {
        // Delay hiding to allow click on dropdown items
        setTimeout(() => {
            const dropdowns = [...this.showProductDropdowns()];
            dropdowns[index] = false;
            this.showProductDropdowns.set(dropdowns);
        }, 200);
    }

    getFilteredProducts(index: number): ProductOption[] {
        const query = this.productSearchQueries()[index] || '';
        if (!query) return this.products;
        
        return this.products.filter(product => 
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.price.toString().includes(query)
        );
    }

    showProductDropdown(index: number): boolean {
        return this.showProductDropdowns()[index] || false;
    }

    selectProduct(index: number, product: ProductOption) {
        const itemGroup = this.items.at(index) as FormGroup;
        itemGroup.patchValue({
            product_id: product.id,
            product_name: product.name,
            product_sku: product.sku,
            unit_price: product.price,
            unit_cost_at_time: product.unit_cost_at_time,
            subtotal: product.price * itemGroup.get('quantity')?.value
        });

        // Hide dropdown and clear search
        const dropdowns = [...this.showProductDropdowns()];
        dropdowns[index] = false;
        this.showProductDropdowns.set(dropdowns);
        
        const queries = [...this.productSearchQueries()];
        queries[index] = '';
        this.productSearchQueries.set(queries);
        
        this.calculateTotals();
    }

}
