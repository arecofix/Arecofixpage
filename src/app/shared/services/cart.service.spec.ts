import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { CartService } from './cart.service';
import { LoggerService } from '../../core/services/logger.service';
import { ToastService } from './toast.service';
import { Product } from '../interfaces/product.interface';

describe('CartService (QA & Testing)', () => {
  let service: CartService;
  let loggerMock: any;
  let toastMock: any;

  beforeEach(() => {
    // 1. Arrange - Setup Mock dependencies
    loggerMock = {
      debug: jasmine.createSpy('debug')
    };

    toastMock = {
      show: jasmine.createSpy('show')
    };

    // Ensure clean local storage before each test
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: LoggerService, useValue: loggerMock },
        { provide: ToastService, useValue: toastMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(CartService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería inicializarse vacío (Unit Test: Setup)', () => {
    // Assert
    expect(service.cartItems().length).toBe(0);
    expect(service.totalItems()).toBe(0);
    expect(service.totalPrice()).toBe(0);
  });

  it('debería agregar un nuevo producto correctamente (Integration Test: State)', () => {
    // Arrange
    const product: Product = {
      id: 'prod-1',
      name: 'Módulo Display Motorola',
      price: 15000,
      slug: 'modulo-display-motorola',
    } as Product;

    // Act
    service.addToCart(product);

    // Assert
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].product.id).toBe('prod-1');
    expect(service.cartItems()[0].quantity).toBe(1);
    expect(service.totalPrice()).toBe(15000);
    
    // Verifica que se llamó la notificación
    expect(toastMock.show).toHaveBeenCalled();
  });

  it('debería incrementar la cantidad si el producto ya existe (Unit Test: Duplicates)', () => {
    // Arrange
    const product: Product = {
        id: 'prod-2',
        name: 'Batería iPhone 11',
        price: 25000,
        slug: 'bateria-iphone-11',
    } as Product;

    // Act
    service.addToCart(product);
    service.addToCart(product); // Add the same again

    // Assert
    expect(service.cartItems().length).toBe(1);
    expect(service.cartItems()[0].quantity).toBe(2);
    expect(service.totalPrice()).toBe(50000);
  });

  it('debería calcular matemáticamente correcto items múltiples (Red Team: Fuzzing Prices)', () => {
    // Arrange
    const p1 = { id: 'p1', price: 10.50 } as Product;
    const p2 = { id: 'p2', price: 5.25 } as Product;
    
    // Act
    service.addToCart(p1);
    service.addToCart(p1); // quantity 2 -> 21.00
    service.addToCart(p2); // quantity 1 -> 5.25

    // Assert
    expect(service.totalItems()).toBe(3);
    expect(service.totalPrice()).toBe(26.25);
  });

  it('debería actualizar manualmente la cantidad (Unit Test: Bounds/Limits)', () => {
    const product = { id: 'p3', price: 1000 } as Product;
    service.addToCart(product);

    // Update to 5
    service.updateQuantity('p3', 5);
    expect(service.cartItems()[0].quantity).toBe(5);
    expect(service.totalPrice()).toBe(5000);

    // Update to 0 (Should remove the item logically)
    service.updateQuantity('p3', 0);
    expect(service.cartItems().length).toBe(0);
  });

  it('debería guardar y recuperar persistencia del LocalStorage (Integration Test)', () => {
    // Given an empty cart service that we mutate
    const product = { id: 'p10', price: 500, name: 'Glass' } as Product;
    service.addToCart(product);

    // Simulate page reload by creating a NEW service instance which reads LocalStorage
    localStorage.setItem('cart', JSON.stringify([{ product: { id: 'p99', price: 100 }, quantity: 3 }]));
    
    let reloadedServiceNew: CartService;
    TestBed.runInInjectionContext(() => {
      reloadedServiceNew = new CartService();
    });

    expect(reloadedServiceNew!.cartItems().length).toBe(1);
    expect(reloadedServiceNew!.cartItems()[0].product.id).toBe('p99');
    expect(reloadedServiceNew!.totalPrice()).toBe(300);
  });
});
