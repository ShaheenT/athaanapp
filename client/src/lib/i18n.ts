import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      search: 'Search',
      refresh: 'Refresh',
      
      // Navigation
      dashboard: 'Dashboard',
      users: 'Users',
      devices: 'Devices',
      prayerTimes: 'Prayer Times',
      audioProfiles: 'Audio Profiles',
      technicians: 'Technicians',
      settings: 'Settings',
      
      // Prayer Times
      fajr: 'Fajr',
      dhuhr: 'Dhuhr',
      asr: 'Asr',
      maghrib: 'Maghrib',
      isha: 'Isha',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      currentPrayer: 'Current Prayer',
      nextPrayer: 'Next Prayer',
      prayerAlert: 'Prayer Alert',
      
      // Dashboard
      totalUsers: 'Total Users',
      activeDevices: 'Active Devices',
      totalDevices: 'Total Devices',
      deviceStatus: 'Device Status',
      recentActivity: 'Recent Activity',
      
      // Customer App
      welcome: 'Assalamu Alaikum',
      volume: 'Volume',
      mute: 'Mute',
      unmute: 'Unmute',
      subscription: 'Subscription',
      payNow: 'Pay Now',
      prayerAlerts: 'Prayer Alerts',
      
      // Notifications
      prayerTimeIn: 'Prayer time in {{minutes}} minutes',
      prepareForPrayer: 'Prepare for prayer',
      paymentReminder: 'Payment Reminder',
      subscriptionDue: 'Your monthly subscription of R{{amount}} is due on {{date}}',
      
      // Status
      online: 'Online',
      offline: 'Offline',
      maintenance: 'Maintenance',
      active: 'Active',
      inactive: 'Inactive',
      enabled: 'Enabled',
      disabled: 'Disabled',
      
      // Forms
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      forgotPassword: 'Forgot Password?',
      
      // Messages
      loginSuccessful: 'Login successful',
      loginFailed: 'Login failed',
      volumeUpdated: 'Volume updated',
      notificationsEnabled: 'Notifications enabled',
      notificationsDisabled: 'Notifications disabled',
      paymentInitiated: 'Payment initiated',
      paymentFailed: 'Payment failed'
    }
  },
  ar: {
    translation: {
      // Common
      loading: 'جاري التحميل...',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      edit: 'تعديل',
      search: 'بحث',
      refresh: 'تحديث',
      
      // Navigation
      dashboard: 'لوحة التحكم',
      users: 'المستخدمون',
      devices: 'الأجهزة',
      prayerTimes: 'أوقات الصلاة',
      audioProfiles: 'ملفات الصوت',
      technicians: 'الفنيون',
      settings: 'الإعدادات',
      
      // Prayer Times
      fajr: 'الفجر',
      dhuhr: 'الظهر',
      asr: 'العصر',
      maghrib: 'المغرب',
      isha: 'العشاء',
      sunrise: 'الشروق',
      sunset: 'الغروب',
      currentPrayer: 'الصلاة الحالية',
      nextPrayer: 'الصلاة التالية',
      prayerAlert: 'تنبيه الصلاة',
      
      // Dashboard
      totalUsers: 'إجمالي المستخدمين',
      activeDevices: 'الأجهزة النشطة',
      totalDevices: 'إجمالي الأجهزة',
      deviceStatus: 'حالة الجهاز',
      recentActivity: 'النشاط الحديث',
      
      // Customer App
      welcome: 'السلام عليكم',
      volume: 'مستوى الصوت',
      mute: 'كتم الصوت',
      unmute: 'إلغاء كتم الصوت',
      subscription: 'الاشتراك',
      payNow: 'ادفع الآن',
      prayerAlerts: 'تنبيهات الصلاة',
      
      // Notifications
      prayerTimeIn: 'موعد الصلاة خلال {{minutes}} دقائق',
      prepareForPrayer: 'استعد للصلاة',
      paymentReminder: 'تذكير الدفع',
      subscriptionDue: 'اشتراكك الشهري بقيمة {{amount}} ريال مستحق في {{date}}',
      
      // Status
      online: 'متصل',
      offline: 'غير متصل',
      maintenance: 'صيانة',
      active: 'نشط',
      inactive: 'غير نشط',
      enabled: 'مفعل',
      disabled: 'معطل',
      
      // Forms
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      fullName: 'الاسم الكامل',
      phoneNumber: 'رقم الهاتف',
      address: 'العنوان',
      signIn: 'تسجيل الدخول',
      signOut: 'تسجيل الخروج',
      forgotPassword: 'نسيت كلمة المرور؟',
      
      // Messages
      loginSuccessful: 'تم تسجيل الدخول بنجاح',
      loginFailed: 'فشل تسجيل الدخول',
      volumeUpdated: 'تم تحديث مستوى الصوت',
      notificationsEnabled: 'تم تفعيل التنبيهات',
      notificationsDisabled: 'تم إلغاء تفعيل التنبيهات',
      paymentInitiated: 'تم بدء عملية الدفع',
      paymentFailed: 'فشل في عملية الدفع'
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    
    interpolation: {
      escapeValue: false // React already does escaping
    },
    
    react: {
      useSuspense: false
    }
  });

export default i18n;