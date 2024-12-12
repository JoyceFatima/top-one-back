import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../email/email.service';
import { OrderStatusChangedEvent } from './order-status-changed.event';

@Injectable()
export class OrderStatusChangedListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('order.status.changed')
  async handleOrderStatusChangedEvent(event: OrderStatusChangedEvent) {
    const { orderId, oldStatus, newStatus, clientEmail, clientName } = event;

    await this.emailService.sendEmail({
      receiverEmail: clientEmail,
      customerName: clientName,
      orderId,
      newStatus,
    });

    console.log(
      `Email sent to ${clientEmail} for Order ID: ${orderId}, Status changed from ${oldStatus} to ${newStatus}`,
    );
  }
}
