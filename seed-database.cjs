const mongoose = require('mongoose');
const { User } = require('./server/models/User');
const { CustomerProfile } = require('./server/models/CustomerProfile');
const { Device } = require('./server/models/Device');
const { PrayerTimes } = require('./server/models/PrayerTimes');
const { AudioProfile } = require('./server/models/AudioProfile');
const { Technician } = require('./server/models/Technician');
const { ActivityLog } = require('./server/models/ActivityLog');

const MONGODB_URI = "mongodb://localhost:27017/athaan_fi_beit";

async function seedDatabase() {
  try {
    console.log('🌱 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      CustomerProfile.deleteMany({}),
      Device.deleteMany({}),
      PrayerTimes.deleteMany({}),
      AudioProfile.deleteMany({}),
      Technician.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);

    // Seed Users
    console.log('👥 Seeding users...');
    const users = await User.insertMany([
      {
        fullName: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        roles: ['customer']
      },
      {
        fullName: 'Fatima Al-Zahra',
        email: 'fatima.alzahra@email.com',
        roles: ['customer']
      },
      {
        fullName: 'Omar Abdullah',
        email: 'omar.abdullah@email.com',
        roles: ['customer']
      },
      {
        fullName: 'Aisha Ibrahim',
        email: 'aisha.ibrahim@email.com',
        roles: ['customer']
      },
      {
        fullName: 'Mohammed Ali',
        email: 'mohammed.ali@email.com',
        roles: ['customer']
      },
      {
        fullName: 'Admin User',
        email: 'admin@athaanfibeit.com',
        roles: ['admin']
      }
    ]);

    // Seed Customer Profiles
    console.log('🏠 Seeding customer profiles...');
    const customerProfiles = await CustomerProfile.insertMany([
      {
        userId: users[0]._id,
        fullName: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phoneNumber: '+27821234567',
        membershipId: 'MEM001',
        subscriptionType: 'monthly',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Cape Town',
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: false
        }
      },
      {
        userId: users[1]._id,
        fullName: 'Fatima Al-Zahra',
        email: 'fatima.alzahra@email.com',
        phoneNumber: '+27821234568',
        membershipId: 'MEM002',
        subscriptionType: 'annual',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Johannesburg',
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: true
        }
      },
      {
        userId: users[2]._id,
        fullName: 'Omar Abdullah',
        email: 'omar.abdullah@email.com',
        phoneNumber: '+27821234569',
        membershipId: 'MEM003',
        subscriptionType: 'monthly',
        paymentStatus: 'overdue',
        accountEnabled: false,
        location: 'Durban',
        notificationPreferences: {
          prayerAlerts: false,
          paymentReminders: true,
          systemNotifications: false
        }
      },
      {
        userId: users[3]._id,
        fullName: 'Aisha Ibrahim',
        email: 'aisha.ibrahim@email.com',
        phoneNumber: '+27821234570',
        membershipId: 'MEM004',
        subscriptionType: 'monthly',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Pretoria',
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: false,
          systemNotifications: true
        }
      },
      {
        userId: users[4]._id,
        fullName: 'Mohammed Ali',
        email: 'mohammed.ali@email.com',
        phoneNumber: '+27821234571',
        membershipId: 'MEM005',
        subscriptionType: 'annual',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Port Elizabeth',
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: true
        }
      }
    ]);

    // Seed Devices
    console.log('📱 Seeding devices...');
    const devices = await Device.insertMany([
      {
        serialNumber: 'AFB-001-CT',
        deviceId: 'device_001',
        customerId: customerProfiles[0]._id,
        isOnline: true,
        lastSeen: new Date(),
        location: 'Cape Town - Main Mosque',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -45,
        status: 'active'
      },
      {
        serialNumber: 'AFB-002-JHB',
        deviceId: 'device_002',
        customerId: customerProfiles[1]._id,
        isOnline: true,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        location: 'Johannesburg - Masjid Al-Noor',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -52,
        status: 'active'
      },
      {
        serialNumber: 'AFB-003-DBN',
        deviceId: 'device_003',
        customerId: customerProfiles[2]._id,
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        location: 'Durban - Juma Masjid',
        firmwareVersion: '1.1.5',
        wifiSignalStrength: -65,
        status: 'maintenance'
      },
      {
        serialNumber: 'AFB-004-PTA',
        deviceId: 'device_004',
        customerId: customerProfiles[3]._id,
        isOnline: true,
        lastSeen: new Date(),
        location: 'Pretoria - Islamic Center',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -48,
        status: 'active'
      },
      {
        serialNumber: 'AFB-005-PE',
        deviceId: 'device_005',
        customerId: null,
        isOnline: false,
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        location: 'Warehouse - Unassigned',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: 0,
        status: 'inactive'
      }
    ]);

    // Seed Prayer Times
    console.log('🕌 Seeding prayer times...');
    const today = new Date().toISOString().split('T')[0];
    const prayerTimes = await PrayerTimes.insertMany([
      {
        date: today,
        locationName: 'Cape Town',
        locationHash: 'cape_town',
        fajrTime: '05:15',
        dhuhrTime: '12:30',
        asrTime: '15:45',
        maghribTime: '18:42',
        ishaTime: '20:15',
        sunriseTime: '06:45',
        sunsetTime: '18:42',
        source: 'Aladhan API'
      },
      {
        date: today,
        locationName: 'Johannesburg',
        locationHash: 'johannesburg',
        fajrTime: '04:52',
        dhuhrTime: '12:08',
        asrTime: '15:22',
        maghribTime: '18:19',
        ishaTime: '19:52',
        sunriseTime: '06:22',
        sunsetTime: '18:19',
        source: 'Aladhan API'
      },
      {
        date: today,
        locationName: 'Durban',
        locationHash: 'durban',
        fajrTime: '05:05',
        dhuhrTime: '11:58',
        asrTime: '15:12',
        maghribTime: '18:09',
        ishaTime: '19:42',
        sunriseTime: '06:35',
        sunsetTime: '18:09',
        source: 'Aladhan API'
      }
    ]);

    // Seed Audio Profiles
    console.log('🔊 Seeding audio profiles...');
    const audioProfiles = await AudioProfile.insertMany([
      {
        name: 'Traditional Makki',
        description: 'Classic Makki style Athaan',
        fileName: 'makki_traditional.mp3',
        duration: 180,
        isDefault: true,
        language: 'Arabic',
        reciter: 'Sheikh Abdullah Al-Makki'
      },
      {
        name: 'Madani Style',
        description: 'Beautiful Madani style Athaan',
        fileName: 'madani_style.mp3',
        duration: 195,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Mohammed Al-Madani'
      },
      {
        name: 'Modern Harmonic',
        description: 'Contemporary harmonic Athaan',
        fileName: 'modern_harmonic.mp3',
        duration: 175,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Ahmad Al-Harmoni'
      }
    ]);

    // Seed Technicians
    console.log('🔧 Seeding technicians...');
    const technicians = await Technician.insertMany([
      {
        fullName: 'Yusuf Al-Technician',
        email: 'yusuf.tech@athaanfibeit.com',
        phoneNumber: '+27821234580',
        employeeId: 'TECH001',
        specialization: 'Audio Systems',
        isActive: true,
        location: 'Cape Town'
      },
      {
        fullName: 'Ibrahim Al-Network',
        email: 'ibrahim.network@athaanfibeit.com',
        phoneNumber: '+27821234581',
        employeeId: 'TECH002',
        specialization: 'Network Configuration',
        isActive: true,
        location: 'Johannesburg'
      },
      {
        fullName: 'Hassan Al-Hardware',
        email: 'hassan.hardware@athaanfibeit.com',
        phoneNumber: '+27821234582',
        employeeId: 'TECH003',
        specialization: 'Hardware Maintenance',
        isActive: false,
        location: 'Durban'
      }
    ]);

    // Seed Activity Logs
    console.log('📋 Seeding activity logs...');
    const activityLogs = await ActivityLog.insertMany([
      {
        action: 'device_connected',
        description: `Device ${devices[0].serialNumber} connected successfully`,
        userId: customerProfiles[0]._id,
        deviceId: devices[0]._id,
        metadata: { location: 'Cape Town', signalStrength: -45 }
      },
      {
        action: 'prayer_played',
        description: 'Maghrib prayer call played',
        userId: customerProfiles[1]._id,
        deviceId: devices[1]._id,
        metadata: { prayerName: 'Maghrib', audioProfile: 'Traditional Makki' }
      },
      {
        action: 'maintenance_mode',
        description: `Device ${devices[2].serialNumber} entered maintenance mode`,
        userId: null,
        deviceId: devices[2]._id,
        metadata: { reason: 'Low WiFi signal', technician: 'TECH003' }
      },
      {
        action: 'user_registered',
        description: 'New customer profile created',
        userId: customerProfiles[4]._id,
        deviceId: null,
        metadata: { membershipId: 'MEM005', subscriptionType: 'annual' }
      },
      {
        action: 'payment_processed',
        description: 'Monthly subscription payment processed',
        userId: customerProfiles[0]._id,
        deviceId: null,
        metadata: { amount: 299, currency: 'ZAR', paymentMethod: 'PayFast' }
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Customer Profiles: ${customerProfiles.length}`);
    console.log(`   - Devices: ${devices.length}`);
    console.log(`   - Prayer Times: ${prayerTimes.length}`);
    console.log(`   - Audio Profiles: ${audioProfiles.length}`);
    console.log(`   - Technicians: ${technicians.length}`);
    console.log(`   - Activity Logs: ${activityLogs.length}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDatabase();