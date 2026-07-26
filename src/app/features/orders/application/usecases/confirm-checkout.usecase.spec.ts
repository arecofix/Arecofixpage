import { TestBed } from '@angular/core/testing';
import { ConfirmCheckoutUseCase } from './confirm-checkout.usecase';
import { OrderRepository } from '../../domain/repositories/order.repository';
import { MessageRepository } from '../../../messages/domain/repositories/message.repository';
import { Observable, of } from 'rxjs';

describe('ConfirmCheckoutUseCase', () => {
  let useCase: ConfirmCheckoutUseCase;
  let orderRepoSpy: jest.Mocked<OrderRepository>;
  let messageRepoSpy: jest.Mocked<MessageRepository>;

  beforeEach(() => {
    const orderSpy = { createOrder: jest.fn() };
    const messageSpy = { saveMessage: jest.fn() };

    TestBed.configureTestingModule({
      providers: [
        ConfirmCheckoutUseCase,
        { provide: OrderRepository, useValue: orderSpy },
        { provide: MessageRepository, useValue: messageSpy }
      ]
    });

    useCase = TestBed.inject(ConfirmCheckoutUseCase);
    orderRepoSpy = TestBed.inject(OrderRepository) as jest.Mocked<OrderRepository>;
    messageRepoSpy = TestBed.inject(MessageRepository) as jest.Mocked<MessageRepository>;
  });

  it('debe completar el checkout creando una orden y guardando un mensaje en el CRM', (done) => {
    const mockOrder = { id: 'order-123', customer_name: 'Ezequiel Test', total: 500 } as any;
    orderRepoSpy.createOrder.mockReturnValue(of(mockOrder));
    messageRepoSpy.saveMessage.mockReturnValue(Promise.resolve({ success: true }) as any);

    const checkoutParams = {
      customer: {
        name: 'Ezequiel Test',
        email: 'test@example.com',
        phone: '1122334455',
        address: 'Calle Falsa 123',
        notes: 'Urgente'
      },
      items: [
        {
          product: { id: 'prod-1', name: 'Pantalla iPhone 11', price: 250 },
          quantity: 2
        }
      ],
      total: 500
    };

    useCase.execute(checkoutParams).subscribe(result => {
      expect(result).toEqual(mockOrder);
      expect(orderRepoSpy.createOrder).toHaveBeenCalled();
      
      // Verificar que los datos pasados al repositorio de órdenes coincidan
      const orderArg = orderRepoSpy.createOrder.mock.calls[0][0];
      expect(orderArg.customer_name).toBe('Ezequiel Test');
      expect(orderArg.items!.length).toBe(1);
      expect(orderArg.items![0].subtotal).toBe(500);

      // Verificar que se guardó el mensaje en el CRM
      expect(messageRepoSpy.saveMessage).toHaveBeenCalled();
      const messageArg = messageRepoSpy.saveMessage.mock.calls[0][0];
      expect(messageArg.name).toBe('Ezequiel Test');
      expect(messageArg.notes).toContain('Pedido Web');

      done();
    });
  });

  it('debe manejar errores si la creación de la orden falla', (done) => {
    orderRepoSpy.createOrder.mockReturnValue(new Observable(subscriber => {
        subscriber.error(new Error('DB Error'));
    }));

    const checkoutParams = {
        customer: { name: 'Test', email: 'test@test.com', phone: '1', address: '...' },
        items: [],
        total: 0
    };

    useCase.execute(checkoutParams).subscribe({
        error: (err) => {
            expect(err.message).toBe('DB Error');
            expect(messageRepoSpy.saveMessage).not.toHaveBeenCalled();
            done();
        }
    });
  });
});
