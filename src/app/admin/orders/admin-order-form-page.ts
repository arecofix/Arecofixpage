import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '@app/core/services/order.service';
import { Order, OrderItem, OrderWithItems } from '@app/shared/interfaces/order.interface';
import { AuthService } from '@app/core/services/auth.service';

import { OrderNotificationService } from '@app/features/orders/services/order-notification.service'; // Import Ecommerce Notification service
import { ProductRepository } from '@app/features/products/domain/repositories/product.repository';

interface ProductOption {
    id: string;
    name: string;
    sku: string;
    price: number;
    stock: number;
}

@Component({
    selector: 'app-admin-order-form-page',
    standalone: true,
    imports: [FormsModule, RouterLink],
    templateUrl: './admin-order-form-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private orderNotificationService = inject(OrderNotificationService); // Inject Ecommerce Service
    private productRepository = inject(ProductRepository); // Inject clean ProductRepository
    private cdr = inject(ChangeDetectorRef);


    id: string | null = null;
    loading = true;
    saving = false;
    error: string | null = null;
    private originalStatus: string | null = null; // Store original status


    products: ProductOption[] = [];
    clients: any[] = [];

    form = signal<Order>({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        shipping_address: {
            street: '',
            number: '',
            city: 'Marcos Paz',
            neighborhood: ''
        },
        status: 'pending',

        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        payment_method: 'efectivo',
        notes: ''
    });

    items = signal<OrderItem[]>([]);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');

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
            const { data, error } = await this.authService.getSupabaseClient()
                .from('profiles')
                .select('id, full_name, first_name, last_name, email, phone, address')
                .eq('role', 'user')
                .limit(50);
            
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
            this.form.update(f => ({
                ...f,
                user_id: client.id,
                customer_name: client.displayName,
                customer_email: client.email || f.customer_email,
                customer_phone: client.phone || f.customer_phone,
                shipping_address: typeof client.address === 'string' ? { ...f.shipping_address as any, street: client.address } : (client.address || f.shipping_address)
            }));
        } else {
            this.form.update(f => ({ ...f, customer_name: clientName }));
        }
    }

    async loadProducts() {
        return new Promise<void>((resolve) => {
            this.productRepository.findAvailable().subscribe({
                next: (products) => {
                    this.products = products.map(p => ({
                        id: p.id,
                        name: p.name,
                        sku: p.sku || '',
                        price: p.price,
                        stock: p.stock || 0
                    }));
                    resolve();
                },
                error: (err) => {
                    console.error('Error loading products', err);
                    resolve();
                }
            });
        });
    }

    async loadOrder() {
        if (!this.id) return;

        this.orderService.getOrderById(this.id).subscribe({
            next: (order: OrderWithItems) => {
                let address = order.shipping_address;
                if (typeof address === 'string') {
                    address = {
                        street: address,
                        number: '',
                        city: 'Marcos Paz',
                        neighborhood: ''
                    };
                }

                this.form.set({
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
                this.items.set(order.items);

                this.originalStatus = order.status; // Capture original status
                this.cdr.markForCheck();

            },
            error: (err: any) => {
                this.error = err.message || 'Error desconocido'; // Default message
                this.cdr.markForCheck();
            }
        });
    }

    addItem() {
        this.items.update(items => [...items, {
            product_name: '',
            quantity: 1,
            unit_price: 0,
            subtotal: 0
        }]);
        this.cdr.markForCheck();
    }

    removeItem(index: number) {
        this.items.update(items => items.filter((_, i) => i !== index));
        this.calculateTotals();
    }

    onSearchProduct(index: number, nameQuery: string) {
        const product = this.products.find(p => p.name === nameQuery);
        
        this.items.update(items => {
            const newItems = [...items];
            if (product) {
                newItems[index] = {
                    ...newItems[index],
                    product_id: product.id,
                    product_name: product.name,
                    product_sku: product.sku,
                    unit_price: product.price,
                    subtotal: product.price * newItems[index].quantity
                };
            } else {
                newItems[index] = {
                    ...newItems[index],
                    product_id: undefined,
                    product_name: nameQuery,
                    product_sku: undefined
                };
            }
            return newItems;
        });
        this.calculateTotals();
    }

    onUnitPriceChange(index: number) {
        this.items.update(items => {
            const newItems = [...items];
            newItems[index].subtotal = newItems[index].unit_price * newItems[index].quantity;
            return newItems;
        });

        this.calculateTotals();
    }

    onQuantityChange(index: number) {
        this.items.update(items => {
            const newItems = [...items];
            newItems[index].subtotal = newItems[index].unit_price * newItems[index].quantity;
            return newItems;
        });

        this.calculateTotals();
    }

    calculateTotals() {
        const subtotal = this.items().reduce((sum, item) => sum + item.subtotal, 0);
        const discount = this.form().discount || 0;
        const taxRate = 0.21; // 21% IVA
        const taxableAmount = subtotal - discount;
        const tax = taxableAmount * taxRate;
        const total = taxableAmount + tax;

        this.form.update(f => ({
            ...f,
            subtotal,
            tax,
            total
        }));

        this.cdr.markForCheck();
    }

    updateStatus(newStatus: Order['status']) {
        this.form.update(f => ({ ...f, status: newStatus }));
        this.cdr.markForCheck();
    }

    async save() {
        if (this.items().length === 0) {
            this.error = 'Debes agregar al menos un producto';
            this.cdr.markForCheck();
            return;
        }

        this.saving = true;
        this.error = null;

        try {
            let result;
            if (this.id) {
                result = await this.orderService.updateOrder(this.id, this.form(), this.items());
            } else {
                result = await this.orderService.createOrder(this.form(), this.items());
            }

            const { error } = result;

            if (error) throw error;

            // Check for status change and notify
            if (this.id && this.originalStatus && this.form().status !== this.originalStatus) {
                const orderData = this.form();
                // Compile purchased products list for Ecommerce Notification
                const productDetails = this.items().map(item => `${item.quantity}x ${item.product_name}`).join(', ');

                const link = this.orderNotificationService.generateWhatsAppLink(
                    orderData.customer_phone || '',
                    orderData.customer_name,
                    orderData.status,
                    result.data?.order_number || this.id.substring(0, 8).toUpperCase(), 
                    productDetails
                );

                if (link) {
                    window.open(link, '_blank');
                }
            }

            this.router.navigate(['/admin/orders']);
        } catch (e: any) {
            this.error = e.message || 'Error al guardar pedido';
            this.saving = false;
            this.cdr.markForCheck();
        }

    }
}
