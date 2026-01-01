// Service Worker for Push Notifications
const CACHE_NAME = 'athaan-fi-beit-v1';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating');
  event.waitUntil(self.clients.claim());
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  if (!event.data) {
    console.log('No data in push event');
    return;
  }

  try {
    const data = event.data.json();
    console.log('Push notification data:', data);

    const options = {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      badge: data.badge || '/icons/badge-72x72.png',
      vibrate: data.vibrate || [200, 100, 200],
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.data?.type === 'prayer_alert', // Keep prayer alerts visible
      silent: false,
      tag: data.data?.type || 'general'
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  } catch (error) {
    console.error('Error handling push notification:', error);
  }
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  let url = '/customer';

  // Handle different notification types and actions
  if (data.type === 'prayer_alert') {
    if (action === 'view_times') {
      url = '/customer#prayer-times';
    } else if (action === 'adjust_volume') {
      url = '/customer#volume';
    }
  } else if (data.type === 'payment_reminder') {
    if (action === 'pay_now') {
      url = '/customer#payment';
    } else if (action === 'view_account') {
      url = '/customer#account';
    }
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url.includes('/customer') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      
      // If no existing window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Background sync for offline notifications
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'prayer-times-sync') {
    event.waitUntil(syncPrayerTimes());
  }
});

async function syncPrayerTimes() {
  try {
    // Sync prayer times when back online
    const response = await fetch('/api/customer/prayer-times');
    if (response.ok) {
      const prayerTimes = await response.json();
      console.log('Prayer times synced:', prayerTimes);
    }
  } catch (error) {
    console.error('Failed to sync prayer times:', error);
  }
}

// Handle fetch events for caching
self.addEventListener('fetch', (event) => {
  // Only cache same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    })
  );
});