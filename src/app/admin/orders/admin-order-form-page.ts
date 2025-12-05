import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '@app/services/order.service';
import { Order, OrderItem } from '@app/shared/interfaces/order.interface';
import { AuthService } from '@app/core/services/auth.service';
import { CommonModule } from '@angular/common';

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
    imports: [FormsModule, RouterLink, CommonModule],
    templateUrl: './admin-order-form-page.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOrderFormPage implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private orderService = inject(OrderService);
    private authService = inject(AuthService);
    private cdr = inject(ChangeDetectorRef);

    id: string | null = null;
    loading = true;
    saving = false;
    error: string | null = null;

    products: ProductOption[] = [];

    form = signal<Order>({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        status: 'pending',
        subtotal: 0,
        tax: 0,
        discount: 0,
        total: 0,
        notes: ''
    });

    items = signal<OrderItem[]>([]);

    async ngOnInit() {
        this.id = this.route.snapshot.paramMap.get('id');

        // Load products
        await this.loadProducts();

        // Load order if editing
        if (this.id) {
            await this.loadOrder();
        }

        this.loading = false;
        this.cdr.markForCheck();
    }

    async loadProducts() {
        const supabase = this.authService.getSupabaseClient();
        const { data, error } = await supabase
            .from('products')
            .select('id, name, sku, price, stock')
            .eq('is_active', true)
            .order('name');

        if (!error && data) {
            this.products = data;
        }
    }

    async loadOrder() {
        if (!this.id) return;

        this.orderService.getOrderById(this.id).subscribe({
            next: (order) => {
                this.form.set({
                    customer_name: order.customer_name,
                    customer_email: order.customer_email,
                    customer_phone: order.customer_phone,
                    customer_address: order.customer_address,
                    status: order.status,
                    subtotal: order.subtotal,
                    tax: order.tax,
                    discount: order.discount,
                    total: order.total,
                    notes: order.notes
                });
                this.items.set(order.items);
                this.cdr.markForCheck();
            },
            error: (err) => {
                this.error = err.message;
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

    onProductSelect(index: number, productId: string) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.items.update(items => {
            const newItems = [...items];
            newItems[index] = {
                ...newItems[index],
                product_id: product.id,
                product_name: product.name,
                product_sku: product.sku,
                unit_price: product.price,
                subtotal: product.price * newItems[index].quantity
            };
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

            this.router.navigate(['/admin/orders']);
        } catch (e: any) {
            this.error = e.message || 'Error al guardar pedido';
            this.saving = false;
            this.cdr.markForCheck();
        }
    }
}
