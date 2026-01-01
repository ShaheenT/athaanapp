import webpush from 'web-push';
import schedule from 'node-schedule';
import { storage } from './storage.ts';

// VAPID keys for push notifications - generate with webpush.generateVAPIDKeys()
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BBWuY88ZBEMtlv_GjMl-59MJFUtZJzUGHntYQmmFpGu2XCgt6_BFKXMzV21UV1noQ0D0ugDqOOiZ3rNZzGqIElI';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || 'i80Sd_CgENd3eEuVXlDcRt3Cc_styu6CMUxGyiTSwZ4';

webpush.setVapidDetails(
  'mailto:admin@athaan-fi-beit.com',
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
}

export class NotificationService {
  private scheduledJobs: Map<string, schedule.Job> = new Map();

  constructor() {
    this.initializePrayerNotifications();
  }

  async sendNotification(subscription: PushSubscription, payload: NotificationPayload) {
    try {
      const notificationPayload = JSON.stringify({
        title: payload.title,
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        badge: payload.badge || '/icons/badge-72x72.png',
        vibrate: [200, 100, 200],
        data: payload.data || {},
        actions: payload.actions || []
      });

      await webpush.sendNotification(subscription, notificationPayload);
      console.log('📱 Notification sent successfully');
      
    } catch (error) {
      console.error('📱 Failed to send notification:', error);
      throw error;
    }
  }

  async sendPrayerAlert(prayerName: string, prayerTime: string, minutesBefore: number = 10) {
    try {
      // Get all active customer subscriptions
      const customers = await storage.getCustomerProfiles();
      
      for (const customer of customers) {
        if (!customer.accountEnabled || !customer.pushSubscription) continue;

        const subscription = JSON.parse(customer.pushSubscription);
        const payload: NotificationPayload = {
          title: `${prayerName} Prayer in ${minutesBefore} minutes`,
          body: `${prayerName} prayer time is at ${prayerTime}. Prepare for prayer.`,
          icon: '/icons/prayer-icon.png',
          data: {
            type: 'prayer_alert',
            prayer: prayerName,
            time: prayerTime,
            minutesBefore
          },
          actions: [
            {
              action: 'view_times',
              title: 'View Prayer Times'
            },
            {
              action: 'adjust_volume',
              title: 'Adjust Volume'
            }
          ]
        };

        await this.sendNotification(subscription, payload);
        
        // Log notification
        await storage.createActivityLog({
          deviceId: customer.deviceId || 0,
          action: 'notification_sent',
          details: `Prayer alert sent for ${prayerName} to ${customer.fullName}`,
          userId: customer.userId
        });
      }

    } catch (error) {
      console.error('📱 Failed to send prayer alerts:', error);
    }
  }

  async sendPaymentReminder(customerId: number, amount: number, dueDate: string) {
    try {
      const customer = await storage.getCustomerProfile(customerId.toString());
      if (!customer?.pushSubscription) return;

      const subscription = JSON.parse(customer.pushSubscription);
      const payload: NotificationPayload = {
        title: 'Payment Reminder',
        body: `Your monthly subscription of R${amount} is due on ${dueDate}`,
        icon: '/icons/payment-icon.png',
        data: {
          type: 'payment_reminder',
          amount,
          dueDate,
          customerId
        },
        actions: [
          {
            action: 'pay_now',
            title: 'Pay Now'
          },
          {
            action: 'view_account',
            title: 'View Account'
          }
        ]
      };

      await this.sendNotification(subscription, payload);

      // Update payment notification status
      await storage.updateCustomerProfile(customerId, {
        lastPaymentNotification: new Date()
      });

    } catch (error) {
      console.error('📱 Failed to send payment reminder:', error);
    }
  }

  async sendSystemAlert(message: string, type: 'info' | 'warning' | 'error' = 'info') {
    try {
      const customers = await storage.getCustomerProfiles();
      
      for (const customer of customers) {
        if (!customer.accountEnabled || !customer.pushSubscription) continue;

        const subscription = JSON.parse(customer.pushSubscription);
        const payload: NotificationPayload = {
          title: type === 'error' ? 'System Alert' : 'Service Update',
          body: message,
          icon: type === 'error' ? '/icons/alert-icon.png' : '/icons/info-icon.png',
          data: {
            type: 'system_alert',
            level: type,
            message
          }
        };

        await this.sendNotification(subscription, payload);
      }

    } catch (error) {
      console.error('📱 Failed to send system alerts:', error);
    }
  }

  async scheduleRecurringPrayerNotifications() {
    // Clear existing jobs
    this.scheduledJobs.forEach(job => job.cancel());
    this.scheduledJobs.clear();

    // Default prayer times (will be replaced with actual times)
    const prayerTimes = {
      fajr: '05:15',
      dhuhr: '12:30',
      asr: '15:45',
      maghrib: '18:42',
      isha: '20:15'
    };

    Object.entries(prayerTimes).forEach(([prayer, time]) => {
      const [hours, minutes] = time.split(':').map(Number);
      
      // Schedule 10-minute warning
      const warningJob = schedule.scheduleJob(`${minutes - 10} ${hours} * * *`, () => {
        this.sendPrayerAlert(prayer.charAt(0).toUpperCase() + prayer.slice(1), time, 10);
      });
      
      // Schedule 2-minute warning
      const finalWarningJob = schedule.scheduleJob(`${minutes - 2} ${hours} * * *`, () => {
        this.sendPrayerAlert(prayer.charAt(0).toUpperCase() + prayer.slice(1), time, 2);
      });

      this.scheduledJobs.set(`${prayer}_warning`, warningJob);
      this.scheduledJobs.set(`${prayer}_final`, finalWarningJob);
    });

    console.log('📱 Prayer notification schedule updated');
  }

  async initializePrayerNotifications() {
    // Schedule recurring notifications
    await this.scheduleRecurringPrayerNotifications();

    // Schedule daily notification refresh at midnight
    schedule.scheduleJob('0 0 * * *', () => {
      this.scheduleRecurringPrayerNotifications();
    });

    console.log('📱 Notification service initialized');
  }

  async subscribeToPushNotifications(customerId: string, subscription: PushSubscription) {
    try {
      await storage.updateCustomerProfile(parseInt(customerId), {
        pushSubscription: JSON.stringify(subscription),
        notificationsEnabled: true
      });

      console.log(`📱 Customer ${customerId} subscribed to push notifications`);
      return true;
    } catch (error) {
      console.error('📱 Failed to subscribe to notifications:', error);
      return false;
    }
  }

  async unsubscribeFromPushNotifications(customerId: string) {
    try {
      await storage.updateCustomerProfile(parseInt(customerId), {
        pushSubscription: null,
        notificationsEnabled: false
      });

      console.log(`📱 Customer ${customerId} unsubscribed from push notifications`);
      return true;
    } catch (error) {
      console.error('📱 Failed to unsubscribe from notifications:', error);
      return false;
    }
  }

  getVapidPublicKey() {
    return VAPID_PUBLIC_KEY;
  }
}

export const notificationService = new NotificationService();