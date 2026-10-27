export class OrderCancelledEvent {
  constructor(
    public readonly orderId: string,
    public readonly cancelledBy: string = 'admin',
    public readonly reason: string = 'Admin cancellation',
    public readonly cancelledAt: Date = new Date(),
  ) {}
}
