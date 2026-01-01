// Push Notification Management
let registration: ServiceWorkerRegistration | null = null;

export interface NotificationSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export class NotificationManager {
  private static instance: NotificationManager;
  private vapidPublicKey: string | null = null;

  static getInstance(): NotificationManager {
    if (!this.instance) {
      this.instance = new NotificationManager();
    }
    return this.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      // Check if service workers and notifications are supported
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications not supported');
        return false;
      }

      // Register service worker
      registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');

      // Get VAPID public key
      const response = await fetch('/api/notifications/vapid-public-key');
      const { publicKey } = await response.json();
      this.vapidPublicKey = publicKey;

      return true;
    } catch (error) {
      console.error('Failed to initialize notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported');
    }

    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  }

  async subscribeToPushNotifications(customerId: string): Promise<boolean> {
    try {
      if (!registration || !this.vapidPublicKey) {
        throw new Error('Service worker not registered or VAPID key missing');
      }

      // Request permission
      const permission = await this.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Subscribe to push notifications
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      // Send subscription to server
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          subscription: {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
              auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
            }
          }
        })
      });

      const result = await response.json();
      if (result.success) {
        console.log('Successfully subscribed to push notifications');
        localStorage.setItem('notifications_enabled', 'true');
        return true;
      } else {
        throw new Error('Failed to subscribe on server');
      }

    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  async unsubscribeFromPushNotifications(customerId: string): Promise<boolean> {
    try {
      if (!registration) {
        throw new Error('Service worker not registered');
      }

      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Notify server
      const response = await fetch('/api/notifications/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId })
      });

      const result = await response.json();
      if (result.success) {
        console.log('Successfully unsubscribed from push notifications');
        localStorage.setItem('notifications_enabled', 'false');
        return true;
      } else {
        throw new Error('Failed to unsubscribe on server');
      }

    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  async isSubscribed(): Promise<boolean> {
    try {
      if (!registration) return false;
      
      const subscription = await registration.pushManager.getSubscription();
      return !!subscription;
    } catch (error) {
      console.error('Failed to check subscription status:', error);
      return false;
    }
  }

  getNotificationPermission(): NotificationPermission {
    return Notification.permission;
  }

  isNotificationSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Utility functions
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  // Show local notification (for testing)
  showLocalNotification(title: string, body: string, options?: NotificationOptions) {
    if (this.getNotificationPermission() === 'granted') {
      new Notification(title, {
        body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });
    }
  }
}

export const notificationManager = NotificationManager.getInstance();