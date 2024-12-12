import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { EmailService } from './email.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email successfully', async () => {
      const mockResponse = { data: { message: 'Email sent successfully' } };
      mockedAxios.post.mockResolvedValue(mockResponse);

      const emailData = {
        receiverEmail: 'customer@example.com',
        customerName: 'John Doe',
        orderId: '12345',
        newStatus: 'Shipped',
      };

      const result = await emailService.sendEmail(emailData);

      expect(result).toEqual(mockResponse.data);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: {
            email: expect.any(String),
            name: 'Top one',
          },
          to: [{ email: emailData.receiverEmail }],
          subject: `Order Status Update - Your Order is Now ${emailData.newStatus}!`,
          textContent: expect.stringContaining(emailData.orderId),
          htmlContent: expect.stringContaining(emailData.customerName),
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': expect.any(String),
          },
        },
      );
    });

    it('should throw an error if the email sending fails', async () => {
      const mockError = {
        response: {
          data: { message: 'Error sending email' },
        },
        message: 'Request failed',
      };
      mockedAxios.post.mockRejectedValue(mockError);

      const emailData = {
        receiverEmail: 'customer@example.com',
        customerName: 'John Doe',
        orderId: '12345',
        newStatus: 'Shipped',
      };

      await expect(emailService.sendEmail(emailData)).rejects.toThrowError(
        'Failed to send email',
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/smtp/email',
        expect.any(Object),
        expect.any(Object),
      );
    });
  });
});
