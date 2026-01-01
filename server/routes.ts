import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
// import { storage } from "./storage.ts.ts"; // Disabled for demo mode
import { 
  demoCustomers, 
  demoDevices, 
  demoPrayerTimes, 
  demoAudioProfiles, 
  demoTechnicians, 
  demoActivityLogs, 
  demoDashboardStats 
} from "./demo-data.ts.ts";
import { setupAuth, isAuthenticated } from "./replitAuth.ts.ts";
import { notificationService } from "./notifications.ts.ts";
import { paymentService } from "./payments.ts.ts";
import { prayerCalculator } from "./prayer-calculator.ts.ts";
import { z } from "zod";
import { 
  insertCustomerProfileSchema,
  insertDeviceSchema,
  insertPrayerTimesSchema,
  insertAudioProfileSchema,
  insertTechnicianSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Demo routes (no authentication required)
  app.get('/api/demo/customers', async (req, res) => {
    const demoCustomers = [
      {
        _id: '1',
        fullName: 'Ahmed Hassan',
        email: 'ahmed.hassan@email.com',
        phoneNumber: '+27821234567',
        membershipId: 'MEM001',
        subscriptionType: 'monthly',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Cape Town',
        createdAt: new Date('2024-01-15'),
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: false
        }
      },
      {
        _id: '2',
        fullName: 'Fatima Al-Zahra',
        email: 'fatima.alzahra@email.com',
        phoneNumber: '+27821234568',
        membershipId: 'MEM002',
        subscriptionType: 'annual',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Johannesburg',
        createdAt: new Date('2024-02-10'),
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: true
        }
      },
      {
        _id: '3',
        fullName: 'Omar Abdullah',
        email: 'omar.abdullah@email.com',
        phoneNumber: '+27821234569',
        membershipId: 'MEM003',
        subscriptionType: 'monthly',
        paymentStatus: 'overdue',
        accountEnabled: false,
        location: 'Durban',
        createdAt: new Date('2024-01-20'),
        notificationPreferences: {
          prayerAlerts: false,
          paymentReminders: true,
          systemNotifications: false
        }
      },
      {
        _id: '4',
        fullName: 'Aisha Ibrahim',
        email: 'aisha.ibrahim@email.com',
        phoneNumber: '+27821234570',
        membershipId: 'MEM004',
        subscriptionType: 'monthly',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Pretoria',
        createdAt: new Date('2024-03-05'),
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: false,
          systemNotifications: true
        }
      },
      {
        _id: '5',
        fullName: 'Mohammed Ali',
        email: 'mohammed.ali@email.com',
        phoneNumber: '+27821234571',
        membershipId: 'MEM005',
        subscriptionType: 'annual',
        paymentStatus: 'active',
        accountEnabled: true,
        location: 'Port Elizabeth',
        createdAt: new Date('2024-02-28'),
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: true
        }
      }
    ];
    res.json(demoCustomers);
  });

  app.get('/api/demo/devices', async (req, res) => {
    const demoDevices = [
      {
        _id: '1',
        serialNumber: 'AFB-001-CT',
        deviceId: 'device_001',
        customerId: '1',
        customer: { fullName: 'Ahmed Hassan', membershipId: 'MEM001' },
        isOnline: true,
        lastSeen: new Date(),
        location: 'Cape Town - Main Mosque',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -45,
        status: 'active'
      },
      {
        _id: '2',
        serialNumber: 'AFB-002-JHB',
        deviceId: 'device_002',
        customerId: '2',
        customer: { fullName: 'Fatima Al-Zahra', membershipId: 'MEM002' },
        isOnline: true,
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        location: 'Johannesburg - Masjid Al-Noor',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -52,
        status: 'active'
      },
      {
        _id: '3',
        serialNumber: 'AFB-003-DBN',
        deviceId: 'device_003',
        customerId: '3',
        customer: { fullName: 'Omar Abdullah', membershipId: 'MEM003' },
        isOnline: false,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
        location: 'Durban - Juma Masjid',
        firmwareVersion: '1.1.5',
        wifiSignalStrength: -65,
        status: 'maintenance'
      },
      {
        _id: '4',
        serialNumber: 'AFB-004-PTA',
        deviceId: 'device_004',
        customerId: '4',
        customer: { fullName: 'Aisha Ibrahim', membershipId: 'MEM004' },
        isOnline: true,
        lastSeen: new Date(),
        location: 'Pretoria - Islamic Center',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: -48,
        status: 'active'
      },
      {
        _id: '5',
        serialNumber: 'AFB-005-PE',
        deviceId: 'device_005',
        customerId: null,
        customer: null,
        isOnline: false,
        lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
        location: 'Warehouse - Unassigned',
        firmwareVersion: '1.2.0',
        wifiSignalStrength: 0,
        status: 'inactive'
      }
    ];
    res.json(demoDevices);
  });

  app.get('/api/demo/prayer-times', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const demoPrayerTimes = [
      {
        _id: '1',
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
        _id: '2',
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
        _id: '3',
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
      },
      {
        _id: '4',
        date: today,
        locationName: 'Pretoria',
        locationHash: 'pretoria',
        fajrTime: '04:55',
        dhuhrTime: '12:10',
        asrTime: '15:25',
        maghribTime: '18:22',
        ishaTime: '19:55',
        sunriseTime: '06:25',
        sunsetTime: '18:22',
        source: 'Aladhan API'
      },
      {
        _id: '5',
        date: today,
        locationName: 'Port Elizabeth',
        locationHash: 'port_elizabeth',
        fajrTime: '05:12',
        dhuhrTime: '12:25',
        asrTime: '15:42',
        maghribTime: '18:38',
        ishaTime: '20:12',
        sunriseTime: '06:42',
        sunsetTime: '18:38',
        source: 'Aladhan API'
      }
    ];
    res.json(demoPrayerTimes);
  });

  app.get('/api/demo/audio-profiles', async (req, res) => {
    const demoAudioProfiles = [
      {
        _id: '1',
        name: 'Traditional Makki',
        description: 'Classic Makki style Athaan with beautiful traditional melody',
        fileName: 'makki_traditional.mp3',
        duration: 180,
        isDefault: true,
        language: 'Arabic',
        reciter: 'Sheikh Abdullah Al-Makki',
        createdAt: new Date('2024-01-01')
      },
      {
        _id: '2',
        name: 'Madani Style',
        description: 'Beautiful Madani style Athaan with melodic variations',
        fileName: 'madani_style.mp3',
        duration: 195,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Mohammed Al-Madani',
        createdAt: new Date('2024-01-15')
      },
      {
        _id: '3',
        name: 'Modern Harmonic',
        description: 'Contemporary harmonic Athaan suitable for urban environments',
        fileName: 'modern_harmonic.mp3',
        duration: 175,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Ahmad Al-Harmoni',
        createdAt: new Date('2024-02-01')
      },
      {
        _id: '4',
        name: 'Haramain Style',
        description: 'Style used in the Two Holy Mosques',
        fileName: 'haramain_style.mp3',
        duration: 200,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Abdul Rahman Al-Sudais',
        createdAt: new Date('2024-02-15')
      },
      {
        _id: '5',
        name: 'Egyptian Classical',
        description: 'Traditional Egyptian Athaan style',
        fileName: 'egyptian_classical.mp3',
        duration: 190,
        isDefault: false,
        language: 'Arabic',
        reciter: 'Sheikh Mohamed Rifaat',
        createdAt: new Date('2024-03-01')
      }
    ];
    res.json(demoAudioProfiles);
  });

  app.get('/api/demo/technicians', async (req, res) => {
    const demoTechnicians = [
      {
        _id: '1',
        fullName: 'Yusuf Al-Technician',
        email: 'yusuf.tech@athaanfibeit.com',
        phoneNumber: '+27821234580',
        employeeId: 'TECH001',
        specialization: 'Audio Systems',
        isActive: true,
        location: 'Cape Town',
        joinedDate: new Date('2023-06-01'),
        completedJobs: 45,
        rating: 4.8
      },
      {
        _id: '2',
        fullName: 'Ibrahim Al-Network',
        email: 'ibrahim.network@athaanfibeit.com',
        phoneNumber: '+27821234581',
        employeeId: 'TECH002',
        specialization: 'Network Configuration',
        isActive: true,
        location: 'Johannesburg',
        joinedDate: new Date('2023-08-15'),
        completedJobs: 38,
        rating: 4.9
      },
      {
        _id: '3',
        fullName: 'Hassan Al-Hardware',
        email: 'hassan.hardware@athaanfibeit.com',
        phoneNumber: '+27821234582',
        employeeId: 'TECH003',
        specialization: 'Hardware Maintenance',
        isActive: false,
        location: 'Durban',
        joinedDate: new Date('2023-04-10'),
        completedJobs: 52,
        rating: 4.6
      },
      {
        _id: '4',
        fullName: 'Abdullah Al-Systems',
        email: 'abdullah.systems@athaanfibeit.com',
        phoneNumber: '+27821234583',
        employeeId: 'TECH004',
        specialization: 'System Integration',
        isActive: true,
        location: 'Pretoria',
        joinedDate: new Date('2023-09-20'),
        completedJobs: 29,
        rating: 4.7
      }
    ];
    res.json(demoTechnicians);
  });

  app.get('/api/demo/dashboard/stats', async (req, res) => {
    const demoStats = {
      totalUsers: 48,
      activeDevices: 12,
      totalDevices: 15,
      nextPrayer: { name: 'Maghrib', time: '6:42 PM' },
      monthlyRevenue: 14352,
      activeSubscriptions: 42,
      systemUptime: '99.8%',
      averageDeviceHealth: 94
    };
    res.json(demoStats);
  });

  // Public registration API (no authentication required)
  app.post('/api/public/register', async (req, res) => {
    try {
      const registrationData = req.body;
      
      // Generate unique membership ID
      const timestamp = Date.now().toString(36);
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      const membershipId = `MEM${timestamp}${randomSuffix}`;

      // Create customer profile with registration data
      const customerProfileData = {
        fullName: registrationData.fullName,
        email: registrationData.email,
        phoneNumber: registrationData.phoneNumber,
        membershipId: membershipId,
        subscriptionType: registrationData.subscriptionType,
        paymentStatus: 'pending',
        accountEnabled: false, // Will be enabled after payment
        location: registrationData.location,
        address: registrationData.address,
        notificationPreferences: {
          prayerAlerts: true,
          paymentReminders: true,
          systemNotifications: registrationData.agreeToMarketing || false
        }
      };

      // Store in database
      const customer = await storage.createCustomerProfile(customerProfileData);

      // Create payment session
      const amount = registrationData.subscriptionType === 'annual' ? 2990 : 299;
      const paymentRequest = {
        customerId: customer._id,
        amount: amount,
        description: `Athaan Fi Beit ${registrationData.subscriptionType === 'annual' ? 'Annual' : 'Monthly'} Subscription`,
        recurringType: registrationData.subscriptionType === 'annual' ? 'annual' : 'monthly',
        subscriptionType: 'new'
      };

      const paymentResult = await paymentService.createPayment(paymentRequest);

      // Log registration activity
      await storage.createActivityLog({
        customerId: customer._id,
        eventType: 'user_registered',
        description: `New customer registered: ${customer.fullName} (${membershipId})`,
        metadata: { 
          membershipId: membershipId,
          subscriptionType: registrationData.subscriptionType,
          location: registrationData.location
        }
      });

      res.status(201).json({
        success: true,
        customer: {
          id: customer._id,
          membershipId: membershipId,
          fullName: customer.fullName,
          email: customer.email
        },
        paymentUrl: paymentResult.paymentUrl,
        paymentId: paymentResult.paymentId,
        message: 'Registration successful. Please complete payment to activate your subscription.'
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Registration failed. Please try again.',
        error: error.message 
      });
    }
  });

  // Payment confirmation webhook (called by PayFast)
  app.post('/api/public/payment/webhook', async (req, res) => {
    try {
      const webhookData = req.body;
      
      // Verify and process payment
      const isValid = await paymentService.handleWebhook(webhookData);
      
      if (isValid) {
        res.status(200).send('OK');
      } else {
        res.status(400).send('Invalid webhook');
      }
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).send('Webhook processing failed');
    }
  });

  // Payment success page data
  app.get('/api/public/payment/success/:paymentId', async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      // Get customer info for confirmation
      const customer = await storage.getCustomerProfileByPaymentId(paymentId);
      
      if (!customer) {
        return res.status(404).json({ message: 'Payment not found' });
      }

      res.json({
        success: true,
        customer: {
          membershipId: customer.membershipId,
          fullName: customer.fullName,
          email: customer.email,
          subscriptionType: customer.subscriptionType,
          paymentStatus: customer.paymentStatus
        },
        message: 'Payment successful! Your Athaan Fi Beit subscription is now active.'
      });

    } catch (error) {
      console.error('Payment success error:', error);
      res.status(500).json({ message: 'Error retrieving payment information' });
    }
  });

  // Simple admin login route
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Hardcoded admin credentials for demo
      if (username === 'admin' && password === 'admin123') {
        const adminUser = {
          _id: 'admin-001',
          username: 'admin',
          email: 'admin@athaanfibeit.com',
          role: 'admin',
          fullName: 'System Administrator',
          isAuthenticated: true
        };
        
        // Store in session
        (req.session as any).user = adminUser;
        (req.session as any).isAuthenticated = true;
        
        res.json({
          success: true,
          user: adminUser,
          message: 'Login successful'
        });
      } else {
        res.status(401).json({
          success: false,
          message: 'Invalid username or password'
        });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Auth routes - demo mode
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Return demo user for testing
      res.json({
        _id: 'demo-user',
        username: 'demo',
        email: 'demo@athaanfibeit.com',
        role: 'admin'
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard stats - demo mode
  app.get('/api/dashboard/stats', async (req, res) => {
    try {
      res.json(demoDashboardStats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Customer Profiles routes - demo mode
  app.get('/api/customers', async (req, res) => {
    try {
      res.json(demoCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post('/api/customers', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertCustomerProfileSchema.parse(req.body);
      const customer = await storage.createCustomerProfile(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        customerId: customer.id,
        eventType: 'user_created',
        description: `New customer profile created: ${customer.fullName}`,
        metadata: { customerMembershipId: customer.membershipId },
      });
      
      res.status(201).json(customer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(400).json({ message: "Failed to create customer", error: error.message });
    }
  });

  app.put('/api/customers/:id', isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      if (req.body.accountEnabled !== undefined) {
        const customer = await storage.updateCustomerAccountStatus(customerId, req.body.accountEnabled);
        res.json(customer);
      } else {
        const validatedData = insertCustomerProfileSchema.partial().parse(req.body);
        const customer = await storage.updateCustomerProfile(customerId, validatedData);
        res.json(customer);
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(400).json({ message: "Failed to update customer", error: error.message });
    }
  });

  app.post('/api/customers/:id/notify', isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      const { type, message } = req.body;
      
      // In a real implementation, this would send actual notifications
      console.log(`Sending ${type} notification to customer ${customerId}: ${message}`);
      
      res.json({ 
        message: `${type.toUpperCase()} notification sent successfully`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  app.delete('/api/customers/:id', isAuthenticated, async (req, res) => {
    try {
      const customerId = parseInt(req.params.id);
      await storage.deleteCustomerProfile(customerId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting customer:", error);
      res.status(400).json({ message: "Failed to delete customer", error: error.message });
    }
  });

  // Customer PWA routes
  app.post('/api/customer/login', async (req, res) => {
    try {
      const { email, userId, password } = req.body;
      
      // Demo login credentials - accept any password for testing
      const demoCustomers = [
        {
          id: "1",
          email: "ahmed@example.com",
          membershipId: "MEM001",
          fullName: "Ahmed Al-Mansouri",
          accountEnabled: true
        },
        {
          id: "2", 
          email: "fatima@example.com",
          membershipId: "MEM002",
          fullName: "Fatima Hassan",
          accountEnabled: true
        },
        {
          id: "3",
          email: "omar@example.com", 
          membershipId: "MEM003",
          fullName: "Omar Abdullah",
          accountEnabled: true
        }
      ];
      
      // Use only demo data (no database lookup for now)
      let customer;
      if (email) {
        customer = demoCustomers.find(c => c.email.toLowerCase() === email.toLowerCase());
      } else if (userId) {
        customer = demoCustomers.find(c => c.membershipId.toUpperCase() === userId.toUpperCase());
      }
      
      // For demo purposes, accept any password
      if (!customer) {
        return res.status(401).json({ message: "User not found. Try: ahmed@example.com or MEM001" });
      }
      
      res.json({
        id: customer.id,
        email: customer.email,
        membershipId: customer.membershipId,
        fullName: customer.fullName
      });
    } catch (error) {
      console.error("Customer login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get('/api/customer/auth', async (req, res) => {
    res.status(401).json({ message: "Not authenticated" });
  });

  app.get('/api/customer/prayer-times', async (req, res) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const prayerTimes = await storage.getPrayerTimes(today);
      
      const now = new Date();
      const currentHour = now.getHours();
      
      let currentPrayer = null;
      let nextPrayer = null;
      
      if (currentHour >= 5 && currentHour < 12) {
        currentPrayer = { name: "Fajr", time: "5:15 AM" };
        nextPrayer = { name: "Dhuhr", time: "12:30 PM" };
      } else if (currentHour >= 12 && currentHour < 15) {
        currentPrayer = { name: "Dhuhr", time: "12:30 PM" };
        nextPrayer = { name: "Asr", time: "3:45 PM" };
      } else if (currentHour >= 15 && currentHour < 18) {
        currentPrayer = { name: "Asr", time: "3:45 PM" };
        nextPrayer = { name: "Maghrib", time: "6:42 PM" };
      } else if (currentHour >= 18 && currentHour < 20) {
        currentPrayer = { name: "Maghrib", time: "6:42 PM" };
        nextPrayer = { name: "Isha", time: "8:15 PM" };
      } else {
        currentPrayer = { name: "Isha", time: "8:15 PM" };
        nextPrayer = { name: "Fajr", time: "5:15 AM" };
      }
      
      res.json({ currentPrayer, nextPrayer });
    } catch (error) {
      console.error("Prayer times error:", error);
      res.status(500).json({ message: "Failed to fetch prayer times" });
    }
  });

  app.post('/api/customer/volume', async (req, res) => {
    try {
      const { volume } = req.body;
      console.log(`Volume set to ${volume}%`);
      res.json({ success: true, volume });
    } catch (error) {
      console.error("Volume update error:", error);
      res.status(500).json({ message: "Failed to update volume" });
    }
  });

  app.post('/api/customer/mute', async (req, res) => {
    try {
      const { muted } = req.body;
      console.log(`Athaan ${muted ? 'muted' : 'unmuted'}`);
      res.json({ success: true, muted });
    } catch (error) {
      console.error("Mute update error:", error);
      res.status(500).json({ message: "Failed to update mute setting" });
    }
  });

  // EiX-piware technician setup demo
  app.get('/eix-setup', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EiX-piware Setup</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #10b981, #059669);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        .logo { text-align: center; margin-bottom: 30px; }
        .logo-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            color: white;
            margin-bottom: 20px;
        }
        h1 { color: #1f2937; font-size: 28px; font-weight: 700; margin-bottom: 10px; }
        .subtitle { color: #6b7280; font-size: 16px; }
        .section { margin: 30px 0; }
        .section h2 { color: #374151; font-size: 20px; margin-bottom: 15px; }
        .status { padding: 15px; border-radius: 10px; margin-bottom: 20px; font-weight: 500; }
        .status.success { background: #d1fae5; color: #065f46; border: 1px solid #a7f3d0; }
        .status.warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .demo-note {
            background: #f0f9ff;
            color: #0369a1;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            border: 1px solid #bae6fd;
            text-align: center;
            font-weight: 500;
        }
        .device-info {
            background: #f8fafc;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #64748b;
        }
        .device-info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .wifi-list {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .wifi-item {
            padding: 15px;
            border-bottom: 1px solid #f3f4f6;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .wifi-item:hover { background: #f9fafb; }
        .wifi-item.selected { background: #ecfdf5; }
        .wifi-info { display: flex; flex-direction: column; }
        .wifi-ssid { font-weight: 600; color: #1f2937; }
        .wifi-details { font-size: 14px; color: #6b7280; }
        .signal-strength { padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 500; }
        .signal-excellent { background: #d1fae5; color: #065f46; }
        .signal-good { background: #fef3c7; color: #92400e; }
        .signal-poor { background: #fee2e2; color: #991b1b; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: 500; color: #374151; }
        input {
            width: 100%;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 16px;
            transition: border-color 0.2s;
        }
        input:focus { outline: none; border-color: #10b981; }
        button {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
            width: 100%;
        }
        button:hover { transform: translateY(-2px); }
        button:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #ffffff;
            border-radius: 50%;
            border-top-color: transparent;
            animation: spin 1s ease-in-out infinite;
            margin-right: 10px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .hidden { display: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="logo">
            <div class="logo-icon">☪</div>
            <h1>EiX-piware</h1>
            <p class="subtitle">Athaan Fi Beit Device Setup</p>
        </div>

        <div class="demo-note">
            📱 Demo Interface - This is what technicians see at 192.168.4.1
        </div>

        <div class="device-info">
            <div class="device-info-row">
                <span>Device ID:</span>
                <span><strong>EiX-A7B2C4D8</strong></span>
            </div>
            <div class="device-info-row">
                <span>Model:</span>
                <span>Raspberry Pi 4B</span>
            </div>
            <div class="device-info-row">
                <span>Version:</span>
                <span>EiX-piware v1.0.0</span>
            </div>
        </div>

        <div class="section">
            <div id="status-indicator" class="status warning">
                ⚠️ Device ready - Please configure WiFi to connect to dashboard
            </div>
        </div>

        <div class="section">
            <h2>WiFi Configuration</h2>
            
            <button onclick="scanWiFi()">
                <span id="scan-loading" class="loading hidden"></span>
                Scan for Networks
            </button>

            <div class="wifi-list">
                <div class="wifi-item" onclick="selectNetwork('CustomerWiFi_5G')">
                    <div class="wifi-info">
                        <div class="wifi-ssid">CustomerWiFi_5G</div>
                        <div class="wifi-details">WPA2 Personal</div>
                    </div>
                    <div class="signal-strength signal-excellent">Excellent</div>
                </div>
                <div class="wifi-item" onclick="selectNetwork('HomeNetwork')">
                    <div class="wifi-info">
                        <div class="wifi-ssid">HomeNetwork</div>
                        <div class="wifi-details">WPA2 Personal</div>
                    </div>
                    <div class="signal-strength signal-good">Good</div>
                </div>
                <div class="wifi-item" onclick="selectNetwork('TELKOM-WiFi')">
                    <div class="wifi-info">
                        <div class="wifi-ssid">TELKOM-WiFi</div>
                        <div class="wifi-details">WPA2 Personal</div>
                    </div>
                    <div class="signal-strength signal-good">Good</div>
                </div>
                <div class="wifi-item" onclick="selectNetwork('MTN_Home')">
                    <div class="wifi-info">
                        <div class="wifi-ssid">MTN_Home</div>
                        <div class="wifi-details">WPA2 Personal</div>
                    </div>
                    <div class="signal-strength signal-poor">Poor</div>
                </div>
            </div>

            <div id="wifi-form" class="hidden">
                <div class="form-group">
                    <label>Network Name (SSID)</label>
                    <input type="text" id="selected-ssid" readonly>
                </div>
                
                <div class="form-group">
                    <label>Password</label>
                    <input type="password" id="password" placeholder="Enter WiFi password">
                </div>

                <button onclick="connectWiFi()">
                    <span id="connect-loading" class="loading hidden"></span>
                    Connect to Network
                </button>
            </div>
        </div>
    </div>

    <script>
        let selectedNetwork = null;

        function scanWiFi() {
            const loadingEl = document.getElementById('scan-loading');
            loadingEl.classList.remove('hidden');
            setTimeout(() => {
                loadingEl.classList.add('hidden');
                alert('Demo: Network scan completed! Available networks are shown above.');
            }, 2000);
        }

        function selectNetwork(ssid) {
            selectedNetwork = ssid;
            document.querySelectorAll('.wifi-item').forEach(item => {
                item.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
            document.getElementById('selected-ssid').value = ssid;
            document.getElementById('wifi-form').classList.remove('hidden');
        }

        function connectWiFi() {
            if (!selectedNetwork) {
                alert('Please select a network first');
                return;
            }
            const password = document.getElementById('password').value;
            if (!password) {
                alert('Please enter the WiFi password');
                return;
            }
            
            const loadingEl = document.getElementById('connect-loading');
            loadingEl.classList.remove('hidden');
            
            setTimeout(() => {
                loadingEl.classList.add('hidden');
                const statusEl = document.getElementById('status-indicator');
                statusEl.className = 'status success';
                statusEl.textContent = '✅ Connected to ' + selectedNetwork + ' - Device online and ready!';
                
                alert('Demo: Successfully connected to ' + selectedNetwork + '!\\n\\n' +
                      '✅ Device is now connected to dashboard\\n' +
                      '✅ Status: Green (Ready)\\n' +
                      '✅ Customer can now use their prayer system\\n\\n' +
                      'Installation complete - technician can leave!');
                
                document.getElementById('wifi-form').classList.add('hidden');
            }, 3000);
        }
    </script>
</body>
</html>
    `);
  });

  // Push notification routes
  app.get('/api/notifications/vapid-public-key', (req, res) => {
    res.json({ publicKey: notificationService.getVapidPublicKey() });
  });

  app.post('/api/notifications/subscribe', async (req, res) => {
    try {
      const { customerId, subscription } = req.body;
      const success = await notificationService.subscribeToPushNotifications(customerId, subscription);
      res.json({ success });
    } catch (error) {
      console.error("Notification subscription error:", error);
      res.status(500).json({ message: "Failed to subscribe to notifications" });
    }
  });

  app.post('/api/notifications/unsubscribe', async (req, res) => {
    try {
      const { customerId } = req.body;
      const success = await notificationService.unsubscribeFromPushNotifications(customerId);
      res.json({ success });
    } catch (error) {
      console.error("Notification unsubscribe error:", error);
      res.status(500).json({ message: "Failed to unsubscribe from notifications" });
    }
  });

  app.post('/api/notifications/test-prayer-alert', isAuthenticated, async (req, res) => {
    try {
      const { prayerName, prayerTime, minutesBefore } = req.body;
      await notificationService.sendPrayerAlert(prayerName, prayerTime, minutesBefore);
      res.json({ success: true, message: "Test prayer alert sent" });
    } catch (error) {
      console.error("Test prayer alert error:", error);
      res.status(500).json({ message: "Failed to send test prayer alert" });
    }
  });

  app.post('/api/notifications/payment-reminder', isAuthenticated, async (req, res) => {
    try {
      const { customerId, amount, dueDate } = req.body;
      await notificationService.sendPaymentReminder(customerId, amount, dueDate);
      res.json({ success: true, message: "Payment reminder sent" });
    } catch (error) {
      console.error("Payment reminder error:", error);
      res.status(500).json({ message: "Failed to send payment reminder" });
    }
  });

  // Payment processing routes
  app.post('/api/payments/create', async (req, res) => {
    try {
      const { customerId, amount, description, recurringType } = req.body;
      
      if (!customerId || !amount || !description) {
        return res.status(400).json({ message: "Missing required payment fields" });
      }

      const payment = await paymentService.createPayment({
        customerId,
        amount: parseFloat(amount),
        description,
        recurringType
      });

      res.json(payment);
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  app.post('/api/payments/webhook', async (req, res) => {
    try {
      const success = await paymentService.handleWebhook(req.body);
      if (success) {
        res.status(200).send('OK');
      } else {
        res.status(400).send('Invalid webhook');
      }
    } catch (error) {
      console.error("Payment webhook error:", error);
      res.status(500).send('Webhook processing failed');
    }
  });

  app.post('/api/payments/cancel-subscription', isAuthenticated, async (req, res) => {
    try {
      const { customerId } = req.body;
      const success = await paymentService.cancelSubscription(customerId);
      res.json({ success });
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  app.get('/api/payments/config', (req, res) => {
    const config = paymentService.getPaymentConfig();
    res.json(config);
  });

  // Customer payment routes
  // Customer device status route
  app.get('/api/customer/device-status', async (req, res) => {
    try {
      // For demo purposes, return sample device status
      const devices = await storage.getDevices();
      const customerDevice = devices.length > 0 ? devices[0] : null;
      
      if (!customerDevice) {
        return res.json({ 
          status: 'no_device',
          message: 'No device assigned to your account',
          isConnected: false
        });
      }

      const isConnected = connectedDevices.has(customerDevice.serialNumber);
      
      res.json({
        status: isConnected ? 'online' : 'offline',
        deviceId: customerDevice.serialNumber,
        location: customerDevice.location || 'Cape Town',
        lastSeen: customerDevice.lastSeen || new Date(),
        isConnected
      });
    } catch (error) {
      console.error("Error fetching customer device status:", error);
      res.status(500).json({ message: "Failed to fetch device status" });
    }
  });

  app.post('/api/customer/create-payment', async (req, res) => {
    try {
      const { customerId, amount } = req.body;
      
      const payment = await paymentService.createPayment({
        customerId,
        amount: parseFloat(amount) || 299.00, // Default R299 monthly
        description: 'Athaan Fi Beit Monthly Subscription',
        recurringType: 'monthly'
      });

      res.json(payment);
    } catch (error) {
      console.error("Customer payment creation error:", error);
      res.status(500).json({ message: "Failed to create payment" });
    }
  });

  // WebSocket handling for device communication  
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const connectedDevices = new Map();

  wss.on('connection', (ws, req) => {
    console.log('Device connected via WebSocket');
    
    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log('Received from device:', message);

        switch (message.type) {
          case 'device_register':
            connectedDevices.set(message.deviceId, ws);
            ws.deviceId = message.deviceId;
            
            // Update device status in database
            const device = await storage.getDeviceBySerial(message.deviceId);
            if (device) {
              await storage.updateDeviceStatus(device.id, true, new Date());
            }
            
            // Send current prayer times to device
            try {
              const prayerTimes = await storage.getTodaysPrayerTimes('Cape Town');
              if (prayerTimes) {
                ws.send(JSON.stringify({
                  type: 'prayer_times_update',
                  prayerTimes: {
                    fajr: prayerTimes.fajr,
                    dhuhr: prayerTimes.dhuhr,
                    asr: prayerTimes.asr,
                    maghrib: prayerTimes.maghrib,
                    isha: prayerTimes.isha
                  }
                }));
              }
            } catch (error) {
              console.error('Failed to send prayer times to device:', error);
            }
            break;

          case 'status_update':
            // Log device status
            await storage.createActivityLog({
              deviceId: null,
              action: 'device_status_update',
              details: JSON.stringify({
                deviceId: message.deviceId,
                status: message.status,
                systemInfo: message.systemInfo,
                timestamp: message.timestamp
              }),
              userId: null
            });
            break;

          case 'prayer_played':
            // Log prayer event
            await storage.createActivityLog({
              deviceId: null,
              action: 'prayer_played',
              details: JSON.stringify({
                deviceId: message.deviceId,
                prayer: message.prayer,
                timestamp: message.timestamp
              }),
              userId: null
            });
            break;
        }
      } catch (error) {
        console.error('Error processing device message:', error);
      }
    });

    ws.on('close', () => {
      if (ws.deviceId) {
        connectedDevices.delete(ws.deviceId);
        console.log(`Device ${ws.deviceId} disconnected`);
      }
    });
  });

  // Device control routes
  app.post('/api/devices/send-command', isAuthenticated, async (req, res) => {
    try {
      const { deviceId, command, data } = req.body;
      const deviceWs = connectedDevices.get(deviceId);
      
      if (!deviceWs || deviceWs.readyState !== 1) { // WebSocket.OPEN = 1
        return res.status(404).json({ message: 'Device not connected' });
      }

      deviceWs.send(JSON.stringify({
        type: command,
        ...data
      }));

      res.json({ success: true, message: 'Command sent to device' });
    } catch (error) {
      console.error('Error sending command to device:', error);
      res.status(500).json({ message: 'Failed to send command' });
    }
  });

  app.post('/api/devices/update-prayer-times', isAuthenticated, async (req, res) => {
    try {
      const { location } = req.body;
      const prayerTimes = await storage.getTodaysPrayerTimes(location || 'Cape Town');
      
      if (!prayerTimes) {
        return res.status(404).json({ message: 'Prayer times not found' });
      }

      // Send to all connected devices
      const message = JSON.stringify({
        type: 'prayer_times_update',
        prayerTimes: {
          fajr: prayerTimes.fajr,
          dhuhr: prayerTimes.dhuhr,
          asr: prayerTimes.asr,
          maghrib: prayerTimes.maghrib,
          isha: prayerTimes.isha
        }
      });

      let sentCount = 0;
      connectedDevices.forEach((ws, deviceId) => {
        if (ws.readyState === 1) { // WebSocket.OPEN = 1
          ws.send(message);
          sentCount++;
        }
      });

      res.json({ 
        success: true, 
        message: `Prayer times sent to ${sentCount} connected devices` 
      });
    } catch (error) {
      console.error('Error updating device prayer times:', error);
      res.status(500).json({ message: 'Failed to update prayer times' });
    }
  });

  // Devices routes
  app.get('/api/devices', isAuthenticated, async (req, res) => {
    try {
      const devices = await storage.getDevices();
      
      // Add connection status for each device
      const devicesWithStatus = devices.map(device => ({
        ...device,
        isConnected: connectedDevices.has(device.serialNumber),
        connectionStatus: connectedDevices.has(device.serialNumber) ? 'connected' : 'disconnected'
      }));
      
      res.json(devicesWithStatus);
    } catch (error) {
      console.error("Error fetching devices:", error);
      res.status(500).json({ message: "Failed to fetch devices" });
    }
  });

  app.get('/api/devices/with-customers', isAuthenticated, async (req, res) => {
    try {
      const devices = await storage.getDevicesWithCustomers();
      res.json(devices);
    } catch (error) {
      console.error("Error fetching devices with customers:", error);
      res.status(500).json({ message: "Failed to fetch devices with customers" });
    }
  });

  app.post('/api/devices', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertDeviceSchema.parse(req.body);
      const device = await storage.createDevice(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        deviceId: device.id,
        eventType: 'device_created',
        description: `New device registered: ${device.serialNumber}`,
        metadata: { deviceSerial: device.serialNumber },
      });
      
      res.status(201).json(device);
    } catch (error) {
      console.error("Error creating device:", error);
      res.status(400).json({ message: "Failed to create device", error: error.message });
    }
  });

  app.put('/api/devices/:id', isAuthenticated, async (req, res) => {
    try {
      const deviceId = parseInt(req.params.id);
      const validatedData = insertDeviceSchema.partial().parse(req.body);
      const device = await storage.updateDevice(deviceId, validatedData);
      res.json(device);
    } catch (error) {
      console.error("Error updating device:", error);
      res.status(400).json({ message: "Failed to update device", error: error.message });
    }
  });

  // Device heartbeat (for Pi devices)
  app.post('/api/devices/:serialNumber/heartbeat', async (req, res) => {
    try {
      const { serialNumber } = req.params;
      const device = await storage.getDeviceBySerial(serialNumber);
      
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }

      await storage.updateDeviceStatus(device.id, true, new Date());
      
      // Log heartbeat
      await storage.createActivityLog({
        deviceId: device.id,
        eventType: 'heartbeat',
        description: `Device ${serialNumber} sent heartbeat`,
        metadata: { deviceSerial: serialNumber },
      });

      res.json({ status: "success", timestamp: new Date().toISOString() });
    } catch (error) {
      console.error("Error processing heartbeat:", error);
      res.status(500).json({ message: "Failed to process heartbeat" });
    }
  });

  // Prayer Times routes
  app.get('/api/prayer-times', isAuthenticated, async (req, res) => {
    try {
      const { date, location } = req.query;
      const prayerTimes = await storage.getPrayerTimes(
        date as string || new Date().toISOString().split('T')[0],
        location as string
      );
      res.json(prayerTimes);
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      res.status(500).json({ message: "Failed to fetch prayer times" });
    }
  });

  app.get('/api/prayer-times/today/:location', async (req, res) => {
    try {
      const { location } = req.params;
      let todaysPrayerTimes = await storage.getTodaysPrayerTimes(location);
      
      // If no prayer times found, try to calculate them using Aladhan API
      if (!todaysPrayerTimes) {
        try {
          todaysPrayerTimes = await prayerCalculator.calculatePrayerTimes(location);
        } catch (apiError) {
          console.error("Failed to calculate prayer times:", apiError);
          // Return default times as fallback
          todaysPrayerTimes = {
            fajr: "05:15",
            dhuhr: "12:30", 
            asr: "15:45",
            maghrib: "18:42",
            isha: "20:15"
          };
        }
      }
      
      res.json(todaysPrayerTimes);
    } catch (error) {
      console.error("Error fetching today's prayer times:", error);
      res.status(500).json({ message: "Failed to fetch today's prayer times" });
    }
  });

  // Prayer calculation routes
  app.post('/api/prayer-times/calculate', isAuthenticated, async (req, res) => {
    try {
      const { location, date } = req.body;
      const prayerTimes = await prayerCalculator.calculatePrayerTimes(location, date);
      res.json(prayerTimes);
    } catch (error) {
      console.error("Prayer calculation error:", error);
      res.status(500).json({ message: "Failed to calculate prayer times" });
    }
  });

  app.post('/api/prayer-times/calculate-monthly', isAuthenticated, async (req, res) => {
    try {
      const { location, year, month } = req.body;
      await prayerCalculator.calculateMonthlyPrayerTimes(location, year, month);
      res.json({ success: true, message: "Monthly prayer times calculated" });
    } catch (error) {
      console.error("Monthly prayer calculation error:", error);
      res.status(500).json({ message: "Failed to calculate monthly prayer times" });
    }
  });

  app.get('/api/prayer-times/locations', (req, res) => {
    const locations = prayerCalculator.getSupportedLocations();
    res.json(locations);
  });

  app.post('/api/prayer-times/auto-calculate', isAuthenticated, async (req, res) => {
    try {
      await prayerCalculator.autoCalculateTodaysPrayerTimes();
      res.json({ success: true, message: "Prayer times auto-calculated for all locations" });
    } catch (error) {
      console.error("Auto prayer calculation error:", error);
      res.status(500).json({ message: "Failed to auto-calculate prayer times" });
    }
  });

  app.post('/api/prayer-times', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertPrayerTimesSchema.parse(req.body);
      const prayerTimes = await storage.createPrayerTimes(validatedData);
      
      // Log activity
      await storage.createActivityLog({
        eventType: 'prayer_times_updated',
        description: `Prayer times updated for ${prayerTimes.locationName} on ${prayerTimes.date}`,
        metadata: { 
          location: prayerTimes.locationName,
          date: prayerTimes.date,
          source: prayerTimes.source 
        },
      });
      
      res.status(201).json(prayerTimes);
    } catch (error) {
      console.error("Error creating prayer times:", error);
      res.status(400).json({ message: "Failed to create prayer times", error: error.message });
    }
  });

  // Audio Profiles routes
  app.get('/api/audio-profiles', isAuthenticated, async (req, res) => {
    try {
      const audioProfiles = await storage.getAudioProfiles();
      res.json(audioProfiles);
    } catch (error) {
      console.error("Error fetching audio profiles:", error);
      res.status(500).json({ message: "Failed to fetch audio profiles" });
    }
  });

  app.post('/api/audio-profiles', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAudioProfileSchema.parse(req.body);
      const audioProfile = await storage.createAudioProfile(validatedData);
      res.status(201).json(audioProfile);
    } catch (error) {
      console.error("Error creating audio profile:", error);
      res.status(400).json({ message: "Failed to create audio profile", error: error.message });
    }
  });

  // Technicians routes
  app.get('/api/technicians', isAuthenticated, async (req, res) => {
    try {
      const technicians = await storage.getTechnicians();
      res.json(technicians);
    } catch (error) {
      console.error("Error fetching technicians:", error);
      res.status(500).json({ message: "Failed to fetch technicians" });
    }
  });

  app.post('/api/technicians', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertTechnicianSchema.parse(req.body);
      const technician = await storage.createTechnician(validatedData);
      res.status(201).json(technician);
    } catch (error) {
      console.error("Error creating technician:", error);
      res.status(400).json({ message: "Failed to create technician", error: error.message });
    }
  });

  // Activity Logs routes
  app.get('/api/activity-logs', isAuthenticated, async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const logs = await storage.getActivityLogs(limit);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  // Simulate IoT device coming online/offline for demo
  app.post('/api/simulate/device/:action', isAuthenticated, async (req, res) => {
    try {
      const { action } = req.params;
      const { deviceId } = req.body;

      if (!deviceId) {
        return res.status(400).json({ message: "Device ID is required" });
      }

      const isOnline = action === 'online';
      await storage.updateDeviceStatus(deviceId, isOnline, new Date());
      
      // Log the simulation activity
      await storage.createActivityLog({
        deviceId,
        eventType: isOnline ? 'device_online' : 'device_offline',
        description: `Device ${isOnline ? 'came online' : 'went offline'} (simulated)`,
        metadata: { simulated: true, action },
      });

      res.json({ status: "success", action, deviceId });
    } catch (error) {
      console.error("Error simulating device action:", error);
      res.status(500).json({ message: "Failed to simulate device action" });
    }
  });

  return httpServer;
}
