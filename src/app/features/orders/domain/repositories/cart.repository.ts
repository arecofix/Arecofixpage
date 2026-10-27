import { Observable } from 'rxjs';
import { Order } from '../entities/order.entity';

/**
 * CartRepository defines the domain abstraction for persisting and retrieving
 * active carts (which are draft orders with status 'cart') in Clean Architecture.
 */
export abstract class CartRepository {
  /**
   * Fetches the active cart for either an authenticated user or an anonymous guest session.
   */
  abstract getActiveCart(userId?: string, sessionId?: string): Observable<Order | null>;

  /**
   * Creates a new cart (order with status 'cart') and its associated order items.
   */
  abstract createCart(cart: Order): Observable<Order>;

  /**
   * Updates an existing cart and re-synchronizes its line items.
   */
  abstract updateCart(id: string, cart: Order | Partial<Order>): Observable<Order>;

  /**
   * Permanently deletes a cart order (e.g. on clear cart or merge).
   */
  abstract deleteCart(id: string): Observable<void>;
}
