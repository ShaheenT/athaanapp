import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer } from 'ws';
import { 
  demoCustomers, 
  demoDevices, 
  demoPrayerTimes, 
  demoAudioProfiles, 
  demoTechnicians, 
  demoActivityLogs, 
  demoDashboardStats 
} from "./demo-data.ts.ts";

// Simple hardcoded admin authentication for demo
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export async function registerStableRoutes(app: Express): Promise<Server> {
  // Simple admin login (no MongoDB dependency)
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      res.json({ 
        success: true, 
        user: { username: 'admin', role: 'admin' },
        message: 'Login successful' 
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Auth routes - demo mode (no authentication required)
  app.get('/api/auth/user', (req, res) => {
    res.json({
      _id: 'demo-user',
      username: 'admin',
      email: 'admin@athaanfibeit.com',
      role: 'admin'
    });
  });

  // Dashboard stats - demo mode
  app.get('/api/dashboard/stats', (req, res) => {
    res.json(demoDashboardStats);
  });

  // Customer routes - demo mode
  app.get('/api/customers', (req, res) => {
    res.json(demoCustomers);
  });

  // Device routes - demo mode
  app.get('/api/devices', (req, res) => {
    res.json(demoDevices);
  });

  app.get('/api/devices/with-customers', (req, res) => {
    const devicesWithCustomers = demoDevices.map(device => ({
      ...device,
      customer: demoCustomers.find(c => c._id === device.customerId)
    }));
    res.json(devicesWithCustomers);
  });

  // Prayer times routes - demo mode
  app.get('/api/prayer-times', (req, res) => {
    res.json(demoPrayerTimes);
  });

  app.get('/api/prayer-times/today', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysPrayerTimes = demoPrayerTimes.filter(pt => pt.date === today);
    res.json(todaysPrayerTimes.length > 0 ? todaysPrayerTimes[0] : demoPrayerTimes[0]);
  });

  // Audio profiles - demo mode
  app.get('/api/audio-profiles', (req, res) => {
    res.json(demoAudioProfiles);
  });

  // Technicians - demo mode
  app.get('/api/technicians', (req, res) => {
    res.json(demoTechnicians);
  });

  // Activity logs - demo mode
  app.get('/api/activity-logs', (req, res) => {
    res.json(demoActivityLogs);
  });

  // Raspberry Pi Control Routes for Testing
  app.post('/api/devices/:deviceId/trigger-prayer', (req, res) => {
    const { deviceId } = req.params;
    const { prayerName, audioProfileId, volume } = req.body;
    
    console.log(`🔊 PRAYER TRIGGERED: ${prayerName} on device ${deviceId}`);
    console.log(`🎵 Audio Profile: ${audioProfileId}, Volume: ${volume}%`);
    
    // Simulate sending command to Raspberry Pi
    const device = demoDevices.find(d => d.deviceId === deviceId);
    if (device) {
      // Update device status
      device.status = 'playing';
      device.audioVolume = volume;
      
      // Log the activity
      const newLog = {
        _id: `log-${Date.now()}`,
        timestamp: new Date(),
        userId: 'admin',
        action: 'Prayer Triggered',
        description: `${prayerName} prayer triggered on device ${deviceId}`,
        category: 'prayer',
        deviceId: deviceId
      };
      demoActivityLogs.unshift(newLog);
      
      res.json({ 
        success: true, 
        message: `Prayer ${prayerName} triggered on device ${deviceId}`,
        device: device
      });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  });

  app.post('/api/devices/:deviceId/volume', (req, res) => {
    const { deviceId } = req.params;
    const { volume } = req.body;
    
    console.log(`🔊 VOLUME CHANGE: Device ${deviceId} volume set to ${volume}%`);
    
    const device = demoDevices.find(d => d.deviceId === deviceId);
    if (device) {
      device.audioVolume = volume;
      
      res.json({ 
        success: true, 
        message: `Volume set to ${volume}% on device ${deviceId}`,
        volume: volume
      });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  });

  app.post('/api/devices/:deviceId/mute', (req, res) => {
    const { deviceId } = req.params;
    const { muted } = req.body;
    
    console.log(`🔇 MUTE TOGGLE: Device ${deviceId} ${muted ? 'muted' : 'unmuted'}`);
    
    const device = demoDevices.find(d => d.deviceId === deviceId);
    if (device) {
      device.isMuted = muted;
      
      res.json({ 
        success: true, 
        message: `Device ${deviceId} ${muted ? 'muted' : 'unmuted'}`,
        muted: muted
      });
    } else {
      res.status(404).json({ success: false, message: 'Device not found' });
    }
  });

  // Manual prayer trigger for testing
  app.post('/api/trigger-prayer-test', (req, res) => {
    const { prayerName = 'Test Prayer', deviceId = 'ATH-PI-001' } = req.body;
    
    console.log(`🧪 TEST PRAYER TRIGGERED: ${prayerName} on ${deviceId}`);
    
    res.json({
      success: true,
      message: `Test prayer "${prayerName}" triggered on device ${deviceId}`,
      timestamp: new Date().toISOString(),
      deviceId: deviceId,
      prayerName: prayerName
    });
  });

  // Create HTTP server for the application
  const httpServer = createServer(app);

  // WebSocket endpoint for device communication (REST-based for simplicity)
  app.get('/api/ws-status', (req, res) => {
    res.json({
      status: 'WebSocket service available',
      endpoint: '/api/device-command',
      timestamp: new Date().toISOString()
    });
  });

  // Device command endpoint (replaces WebSocket for now)
  app.post('/api/device-command', (req, res) => {
    const { deviceId, command, data } = req.body;
    console.log(`📱 Device command received: ${command} for device ${deviceId}`);
    
    res.json({
      success: true,
      message: `Command ${command} sent to device ${deviceId}`,
      timestamp: new Date().toISOString(),
      ack: true
    });
  });

  return httpServer;
}