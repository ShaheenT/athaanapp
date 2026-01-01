import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage.ts';

// PayFast configuration for South African market
const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID || '10000100',
  merchantKey: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
  passphrase: process.env.PAYFAST_PASSPHRASE || 'TestPassPhrase',
  sandbox: process.env.NODE_ENV !== 'production', // Use sandbox for development
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://www.payfast.co.za/eng/process' 
    : 'https://sandbox.payfast.co.za/eng/process'
};

interface PaymentRequest {
  customerId: number;
  amount: number;
  description: string;
  recurringType?: 'monthly' | 'annual';
  subscriptionType?: 'new' | 'renewal';
}

interface PayFastData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  name_first: string;
  name_last: string;
  email_address: string;
  m_payment_id: string;
  amount: string;
  item_name: string;
  item_description: string;
  subscription_type?: '1' | '2'; // 1 = monthly, 2 = annual
  recurring_amount?: string;
  frequency?: '3' | '6'; // 3 = monthly, 6 = annual
  cycles?: '0'; // 0 = indefinite
  signature?: string;
}

export class PaymentService {
  constructor() {
    this.validateConfig();
  }

  private validateConfig() {
    if (!PAYFAST_CONFIG.merchantId || !PAYFAST_CONFIG.merchantKey) {
      console.warn('PayFast configuration incomplete - payments disabled');
    }
  }

  async createPayment(paymentRequest: PaymentRequest): Promise<{ paymentUrl: string; paymentId: string }> {
    try {
      const customer = await storage.getCustomerProfile(paymentRequest.customerId.toString());
      if (!customer) {
        throw new Error('Customer not found');
      }

      const paymentId = uuidv4();
      const [firstName, ...lastNameParts] = customer.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || '';

      // Create PayFast payment data
      const paymentData: PayFastData = {
        merchant_id: PAYFAST_CONFIG.merchantId,
        merchant_key: PAYFAST_CONFIG.merchantKey,
        return_url: `${process.env.BASE_URL || 'http://localhost:5000'}/customer/payment/success`,
        cancel_url: `${process.env.BASE_URL || 'http://localhost:5000'}/customer/payment/cancel`,
        notify_url: `${process.env.BASE_URL || 'http://localhost:5000'}/api/payments/webhook`,
        name_first: firstName,
        name_last: lastName,
        email_address: customer.email,
        m_payment_id: paymentId,
        amount: paymentRequest.amount.toFixed(2),
        item_name: 'Athaan Fi Beit Subscription',
        item_description: paymentRequest.description
      };

      // Add recurring payment fields if specified
      if (paymentRequest.recurringType) {
        paymentData.subscription_type = paymentRequest.recurringType === 'monthly' ? '1' : '2';
        paymentData.recurring_amount = paymentRequest.amount.toFixed(2);
        paymentData.frequency = paymentRequest.recurringType === 'monthly' ? '3' : '6';
        paymentData.cycles = '0'; // Indefinite recurring
      }

      // Generate signature
      paymentData.signature = this.generateSignature(paymentData);

      // Create payment record in database
      await this.createPaymentRecord(paymentId, paymentRequest, 'pending');

      // Generate payment URL
      const paymentUrl = this.generatePaymentUrl(paymentData);

      console.log(`Payment created: ${paymentId} for customer ${paymentRequest.customerId}`);

      return {
        paymentUrl,
        paymentId
      };

    } catch (error) {
      console.error('Failed to create payment:', error);
      throw error;
    }
  }

  private generateSignature(data: PayFastData): string {
    // Remove signature field and empty values
    const signatureData: any = { ...data };
    delete signatureData.signature;
    
    // Remove empty values
    Object.keys(signatureData).forEach(key => {
      if (!signatureData[key]) {
        delete signatureData[key];
      }
    });

    // Create parameter string
    const paramString = Object.keys(signatureData)
      .sort()
      .map(key => `${key}=${encodeURIComponent(signatureData[key])}`)
      .join('&');

    // Add passphrase if configured
    const finalString = PAYFAST_CONFIG.passphrase 
      ? `${paramString}&passphrase=${encodeURIComponent(PAYFAST_CONFIG.passphrase)}`
      : paramString;

    // Generate MD5 hash
    return crypto.createHash('md5').update(finalString).digest('hex');
  }

  private generatePaymentUrl(data: PayFastData): string {
    const params = new URLSearchParams();
    
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        params.append(key, value.toString());
      }
    });

    return `${PAYFAST_CONFIG.baseUrl}?${params.toString()}`;
  }

  private async createPaymentRecord(
    paymentId: string,
    request: PaymentRequest,
    status: 'pending' | 'completed' | 'failed' | 'cancelled'
  ) {
    // For now, we'll store this in activity logs
    // In a real implementation, you'd want a dedicated payments table
    await storage.createActivityLog({
      deviceId: null,
      action: 'payment_created',
      details: JSON.stringify({
        paymentId,
        customerId: request.customerId,
        amount: request.amount,
        description: request.description,
        status,
        recurringType: request.recurringType,
        timestamp: new Date().toISOString()
      }),
      userId: request.customerId.toString()
    });
  }

  async handleWebhook(webhookData: any): Promise<boolean> {
    try {
      console.log('PayFast webhook received:', webhookData);

      // Verify webhook signature
      if (!this.verifyWebhookSignature(webhookData)) {
        console.error('Invalid webhook signature');
        return false;
      }

      const { m_payment_id, payment_status, amount_gross } = webhookData;

      // Update payment status
      await this.updatePaymentStatus(m_payment_id, payment_status, parseFloat(amount_gross));

      // Handle successful payment
      if (payment_status === 'COMPLETE') {
        await this.processSuccessfulPayment(m_payment_id, webhookData);
      }

      return true;

    } catch (error) {
      console.error('Webhook processing failed:', error);
      return false;
    }
  }

  private verifyWebhookSignature(data: any): boolean {
    const receivedSignature = data.signature;
    delete data.signature;

    const generatedSignature = this.generateSignature(data);
    return receivedSignature === generatedSignature;
  }

  private async updatePaymentStatus(paymentId: string, status: string, amount: number) {
    const paymentStatus = status === 'COMPLETE' ? 'completed' : 
                         status === 'FAILED' ? 'failed' : 
                         status === 'CANCELLED' ? 'cancelled' : 'pending';

    await storage.createActivityLog({
      deviceId: null,
      action: 'payment_updated',
      details: JSON.stringify({
        paymentId,
        status: paymentStatus,
        amount,
        timestamp: new Date().toISOString()
      }),
      userId: null
    });
  }

  private async processSuccessfulPayment(paymentId: string, webhookData: any) {
    try {
      // Extract customer information from webhook
      const customerId = await this.getCustomerIdFromPayment(paymentId);
      if (!customerId) return;

      // Update customer payment status
      await storage.updateCustomerProfile(customerId, {
        paymentStatus: 'current',
        subscriptionStatus: 'active'
      });

      // Log successful payment
      await storage.createActivityLog({
        deviceId: null,
        action: 'payment_completed',
        details: JSON.stringify({
          paymentId,
          customerId,
          amount: parseFloat(webhookData.amount_gross),
          timestamp: new Date().toISOString()
        }),
        userId: customerId.toString()
      });

      console.log(`Payment completed successfully for customer ${customerId}`);

    } catch (error) {
      console.error('Failed to process successful payment:', error);
    }
  }

  private async getCustomerIdFromPayment(paymentId: string): Promise<number | null> {
    try {
      // This would typically query a payments table
      // For now, we'll extract from activity logs
      const logs = await storage.getActivityLogs(100);
      const paymentLog = logs.find(log => 
        log.action === 'payment_created' && 
        log.details.includes(paymentId)
      );

      if (paymentLog && paymentLog.details) {
        const details = JSON.parse(paymentLog.details);
        return details.customerId;
      }

      return null;
    } catch (error) {
      console.error('Failed to get customer ID from payment:', error);
      return null;
    }
  }

  async processSubscriptionRenewals() {
    try {
      // Get customers with overdue payments
      const customers = await storage.getCustomerProfiles();
      const overdueCustomers = customers.filter(customer => 
        customer.paymentStatus === 'overdue' && 
        customer.subscriptionStatus === 'active'
      );

      for (const customer of overdueCustomers) {
        // Create renewal payment
        const paymentRequest: PaymentRequest = {
          customerId: customer.id,
          amount: 299.00, // R299 monthly subscription
          description: 'Monthly Athaan Fi Beit Subscription Renewal',
          recurringType: 'monthly',
          subscriptionType: 'renewal'
        };

        try {
          await this.createPayment(paymentRequest);
          console.log(`Renewal payment created for customer ${customer.id}`);
        } catch (error) {
          console.error(`Failed to create renewal for customer ${customer.id}:`, error);
        }
      }

    } catch (error) {
      console.error('Failed to process subscription renewals:', error);
    }
  }

  async cancelSubscription(customerId: number): Promise<boolean> {
    try {
      await storage.updateCustomerProfile(customerId, {
        subscriptionStatus: 'cancelled',
        paymentStatus: 'suspended'
      });

      await storage.createActivityLog({
        deviceId: null,
        action: 'subscription_cancelled',
        details: JSON.stringify({
          customerId,
          timestamp: new Date().toISOString()
        }),
        userId: customerId.toString()
      });

      console.log(`Subscription cancelled for customer ${customerId}`);
      return true;

    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      return false;
    }
  }

  getPaymentConfig() {
    return {
      merchantId: PAYFAST_CONFIG.merchantId,
      sandbox: PAYFAST_CONFIG.sandbox,
      configured: !!(PAYFAST_CONFIG.merchantId && PAYFAST_CONFIG.merchantKey)
    };
  }
}

export const paymentService = new PaymentService();