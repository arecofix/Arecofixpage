import { Injectable, inject } from '@angular/core';
import { OrderService } from '@app/features/orders/application/services/order.service';
import { InvoiceService } from '@app/features/sales/application/invoice.service';
import { FinanceService } from '@app/features/finance/application/services/finance.service';
import { TenantService } from '@app/core/services/tenant.service';
import { BranchContextService } from '@app/core/services/branch-context.service';
import { Order, OrderItem } from '@app/features/orders/domain/entities/order.entity';
import { firstValueFrom } from 'rxjs';

export interface CheckoutRequest {
    cartItems: any[];
    customerName: string;
    discount: number;
    paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
    cartSubtotal: number;
    finalTotal: number;
}

@Injectable({
    providedIn: 'root'
})
export class CheckoutUseCase {
    private orderService = inject(OrderService);
    private invoiceService = inject(InvoiceService);
    private financeService = inject(FinanceService);
    private tenantService = inject(TenantService);
    private branchContextService = inject(BranchContextService);

    /**
     * Executes the checkout process:
     * 1. Creates the Order
     * 2. Generates the Invoice
     * 3. Registers the Finance Movement
     */
    async execute(request: CheckoutRequest): Promise<string> {
        const branch_id = this.branchContextService.getBranchId() || undefined;

        // 1. Create Order
        const order: Order = {
            customer_name: request.customerName || 'Consumidor Final',
            customer_email: undefined,
            status: 'completed',
            subtotal: request.cartSubtotal,
            tax: 0,
            discount: request.discount,
            total: request.finalTotal,
            branch_id: branch_id,
            payment_method: request.paymentMethod
        };

        const rate = this.tenantService.currentTenant()?.usd_rate || 1;
        const items: OrderItem[] = request.cartItems.map(item => {
            const finalUnitPrice = item.currency === 'USD' ? (item.price * rate) : item.price;
            return {
                product_id: item.id,
                product_name: item.name,
                unit_price: finalUnitPrice,
                unit_cost_at_time: item.unit_cost_at_time || 0,
                quantity: item.quantity,
                subtotal: finalUnitPrice * item.quantity
            };
        });

        order.items = items;

        const createdOrder = await firstValueFrom(this.orderService.createOrder(order));
        if (!createdOrder || !createdOrder.id) throw new Error('Order creation failed');

        // 2. Generate Invoice
        const invoiceResult = await this.invoiceService.generateInvoice({
            order_id:      createdOrder.id,
            customer_name: request.customerName || 'Consumidor Final',
            type:          'B',
            origin:        'sale',
            subtotal:      request.cartSubtotal,
            tax_amount:    0,
            discount:      request.discount,
            total_amount:  request.finalTotal,
        });

        if (invoiceResult && invoiceResult.error) {
            console.error('Invoice generation failed: ', invoiceResult.error);
        }

        // 3. Register Cash Movement
        if (request.paymentMethod === 'efectivo') {
            await this.financeService.recordMovement({
                amount: request.finalTotal,
                type: 'income',
                category: 'sale',
                payment_method: 'cash',
                reference_id: createdOrder.id,
                notes: `Venta POS - Ticket #${createdOrder.id.substring(0,8)}`,
                branch_id: branch_id
            });
        }

        return createdOrder.id;
    }
}
