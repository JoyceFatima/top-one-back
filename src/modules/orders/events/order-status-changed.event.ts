export class OrderStatusChangedEvent {
  constructor(
    public readonly orderId: string,
    public readonly oldStatus: string,
    public readonly newStatus: string,
    public readonly clientEmail: string,
    public readonly clientName: string,
  ) {}
}
