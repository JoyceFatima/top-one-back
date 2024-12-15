import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { config } from '@/config';

const { brevoApiKey, brevoSenderEmail } = config.email;

@Injectable()
export class EmailService {
  constructor() {}

  async sendEmail({
    receiverEmail,
    customerName,
    orderId,
    newStatus,
  }: {
    receiverEmail: string;
    customerName: string;
    orderId: string;
    newStatus: string;
  }) {
    try {
      const emailContent = {
        sender: {
          email: brevoSenderEmail,
          name: 'Top one',
        },
        to: [{ email: receiverEmail }],
        subject: `Order Status Update - Your Order is Now ${newStatus}!`,
        textContent: `
         Dear ${customerName},

          We are writing to let you know that the status of your order has been updated.

          Order ID: ${orderId}
          Previous Status: Processing
          New Status: ${newStatus}

          Thank you for shopping with us! You can track your order or contact us if you have any questions.

          Best regards
        `,
        htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333;">Order Status Update</h2>
          <p>Dear <strong>${customerName}</strong>,</p>
          <p>We are writing to let you know that the status of your order has been updated.</p>
          <p>
            <strong>Order ID:</strong> ${orderId}<br>
            <strong>Previous Status:</strong> Processing<br>
            <strong>New Status:</strong> ${newStatus}
          </p>
          <p>Thank you for shopping with us! You can track your order or contact us if you have any questions.</p>
          <p style="color: #555;">Best regards</p>
        </div>
      `,
      };

      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        emailContent,
        {
          headers: {
            'Content-Type': 'application/json',
            'api-key': brevoApiKey,
          },
        },
      );

      return response.data;
    } catch {
      throw new Error('Failed to send email');
    }
  }
}
