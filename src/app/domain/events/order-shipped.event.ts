export class OrderShippedEvent {
  constructor(
    public readonly orderId: string,
    public readonly shippedAt: Date = new Date(),
    public readonly trackingCode?: string,
  ) {}
}
