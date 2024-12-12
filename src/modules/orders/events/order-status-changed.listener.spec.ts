import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../../email/email.service';
import { OrderStatusChangedEvent } from './order-status-changed.event';
import { OrderStatusChangedListener } from './order-status-changed.listener';

describe('OrderStatusChangedListener', () => {
  let listener: OrderStatusChangedListener;
  let emailService: EmailService;

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const mockEvent: OrderStatusChangedEvent = {
    orderId: 'order-123',
    oldStatus: 'PENDING',
    newStatus: 'COMPLETED',
    clientEmail: 'test@example.com',
    clientName: 'John Doe',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderStatusChangedListener,
        { provide: EmailService, useValue: mockEmailService },
      ],
    }).compile();

    listener = module.get<OrderStatusChangedListener>(
      OrderStatusChangedListener,
    );
    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('handleOrderStatusChangedEvent', () => {
    it('should send an email when the order status changes', async () => {
      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await listener.handleOrderStatusChangedEvent(mockEvent);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        receiverEmail: mockEvent.clientEmail,
        customerName: mockEvent.clientName,
        orderId: mockEvent.orderId,
        newStatus: mockEvent.newStatus,
      });

      expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(1);
    });

    it('should log a success message after sending an email', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      mockEmailService.sendEmail.mockResolvedValue(undefined);

      await listener.handleOrderStatusChangedEvent(mockEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        `Email sent to ${mockEvent.clientEmail} for Order ID: ${mockEvent.orderId}, Status changed from ${mockEvent.oldStatus} to ${mockEvent.newStatus}`,
      );

      consoleSpy.mockRestore();
    });

    it('should handle errors if the email service fails', async () => {
      const error = new Error('Email service failure');
      mockEmailService.sendEmail.mockRejectedValue(error);

      await expect(
        listener.handleOrderStatusChangedEvent(mockEvent),
      ).rejects.toThrow(error);

      expect(mockEmailService.sendEmail).toHaveBeenCalledWith({
        receiverEmail: mockEvent.clientEmail,
        customerName: mockEvent.clientName,
        orderId: mockEvent.orderId,
        newStatus: mockEvent.newStatus,
      });
    });
  });
});
