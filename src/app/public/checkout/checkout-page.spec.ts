import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CheckoutPage } from './checkout-page';
import { CartService } from '../../shared/services/cart.service';
import { OrderService } from '../../features/orders/application/services/order.service';
import { PaymentService } from '../../features/orders/application/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { ContactService } from '../../core/services/contact.service';
import { ProductService } from './../products/services/product.service';
import { ProfileService } from '../../core/services/profile.service';
import { BranchService } from '../../core/services/branch.service';
import { ShippingService } from '../../features/orders/application/services/shipping.service';
import { MercadoPagoService } from '../../features/orders/application/services/mercadopago.service';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('CheckoutPage', () => {
  let component: CheckoutPage;

  let cartServiceMock: any;
  let orderServiceMock: any;
  let paymentServiceMock: any;
  let mercadopagoServiceMock: any;
  let branchServiceMock: any;
  let shippingServiceMock: any;
  let authServiceMock: any;
  let contactServiceMock: any;
  let notificationServiceMock: any;

  beforeEach(() => {
    cartServiceMock = {
      cartItems: signal([]),
      totalPrice: signal(0),
      clearCart: jest.fn()
    };

    orderServiceMock = {
      createOrder: jest.fn().mockReturnValue(of({ id: 'order-123', order_number: 'AF-123' }))
    };

    paymentServiceMock = {
      orderStatus: signal(null),
      isUploadingProof: signal(false),
      startPolling: jest.fn(),
      stopPolling: jest.fn(),
      buildPaymentTicket: jest.fn()
    };

    mercadopagoServiceMock = {
      createPreference: jest.fn().mockReturnValue(of({ init_point: 'https://mp.com/pay' }))
    };

    branchServiceMock = {
      getCurrentBranchId: jest.fn().mockReturnValue('branch-1'),
      currentBranch: signal({ name: 'Arecofix', whatsapp_number: '11223344' })
    };

    shippingServiceMock = {
      calculateShipping: jest.fn().mockReturnValue(of({ cost: 500, provider: 'Correo' }))
    };

    authServiceMock = {
      getCurrentUser: jest.fn().mockReturnValue(null)
    };

    contactServiceMock = {
      createMessage: jest.fn().mockResolvedValue(true)
    };

    notificationServiceMock = {
      showError: jest.fn(),
      showSuccess: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CheckoutPage,
        FormBuilder,
        { provide: CartService, useValue: cartServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: PaymentService, useValue: paymentServiceMock },
        { provide: MercadoPagoService, useValue: mercadopagoServiceMock },
        { provide: BranchService, useValue: branchServiceMock },
        { provide: ShippingService, useValue: shippingServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: ContactService, useValue: contactServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ProductService, useValue: { getData: () => of({ data: [] }) } },
        { provide: ProfileService, useValue: { getProfile: () => Promise.resolve(null) } }
      ]
    });

    component = TestBed.inject(CheckoutPage);

    // Pre-fill form so it is valid
    component.checkoutForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '12345678',
      address: {
        street: 'Main St',
        number: '123',
        city: 'City',
        postal_code: '1234'
      }
    });
  });

  it('debería usar el convertedPrice del producto para la orden de Mercado Pago si existe (Test USD a ARS)', async () => {
    // Simulamos un carrito con un producto en USD cuyo convertedPrice es 5000 y raw price es 5
    cartServiceMock.cartItems.set([
      {
        product: { id: 'p1', name: 'iPhone', price: 5, convertedPrice: 5000, currency: 'USD' },
        quantity: 2
      }
    ]);
    cartServiceMock.totalPrice = signal(10000); // 5000 * 2

    component.selectedMethod.set('credit_card');
    
    await component.placeOrder();

    // Verificamos que se haya llamado a createOrder con unit_price 5000, no 5
    expect(orderServiceMock.createOrder).toHaveBeenCalled();
    const orderArg = orderServiceMock.createOrder.mock.calls[0][0];
    expect(orderArg.items[0].unit_price).toBe(5000);
    expect(orderArg.items[0].subtotal).toBe(10000);

    // Verificamos que se haya llamado a Mercado Pago con los orderItems correctos
    expect(mercadopagoServiceMock.createPreference).toHaveBeenCalled();
    const mpItemsArg = mercadopagoServiceMock.createPreference.mock.calls[0][1];
    expect(mpItemsArg[0].unit_price).toBe(5000);
    expect(mpItemsArg[0].subtotal).toBe(10000);
    
    // Verificamos que haga el redirect
    expect(component.mpPaymentUrl()).toBe('https://mp.com/pay');
    expect(component.step()).toBe('mp_redirect');
  });
});
