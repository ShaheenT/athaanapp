#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import WebSocket from 'ws';
import { WiFiManager } from './wifi-manager.js';
import { AudioManager } from './audio-manager.js';
import { DeviceManager } from './device-manager.js';
import { SystemMonitor } from './system-monitor.js';
import { PrayerScheduler } from './prayer-scheduler.js';

const app = express();
const PORT = 3000;
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'ws://localhost:5000/ws';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

class EiXPiware {
  constructor() {
    this.deviceId = null;
    this.customerData = null;
    this.dashboardWs = null;
    this.status = 'initializing'; // initializing, ready, error, maintenance
    
    this.wifiManager = new WiFiManager();
    this.audioManager = new AudioManager();
    this.deviceManager = new DeviceManager();
    this.systemMonitor = new SystemMonitor();
    this.prayerScheduler = new PrayerScheduler();
    
    this.init();
  }

  async init() {
    try {
      console.log('🌙 EiX-piware Starting...');
      
      // Initialize device manager first
      await this.deviceManager.initialize();
      this.deviceId = this.deviceManager.getDeviceId();
      
      console.log(`📱 Device ID: ${this.deviceId}`);
      
      // Setup API routes
      this.setupRoutes();
      
      // Start HTTP server
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 EiX-piware HTTP Server running on port ${PORT}`);
      });
      
      // Start WiFi management
      await this.initializeWiFi();
      
      // Connect to dashboard
      await this.connectToDashboard();
      
      // Start system monitoring
      this.systemMonitor.start((status) => {
        this.updateStatus(status);
      });
      
      // Initialize audio system
      await this.audioManager.initialize();
      
      // Start prayer scheduler
      this.prayerScheduler.start((prayerInfo) => {
        this.playPrayer(prayerInfo);
      });
      
      this.status = 'ready';
      this.sendStatusUpdate();
      
      console.log('✅ EiX-piware fully initialized');
      
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      this.status = 'error';
      this.sendStatusUpdate();
    }
  }

  async initializeWiFi() {
    try {
      const isConnected = await this.wifiManager.isConnected();
      
      if (!isConnected) {
        console.log('📶 No WiFi connection, starting access point...');
        await this.wifiManager.startAccessPoint();
        console.log('📶 Access Point started: EiX-Setup');
        console.log('📶 Connect to EiX-Setup network to configure WiFi');
      } else {
        console.log('📶 WiFi already connected');
        const connectionInfo = await this.wifiManager.getConnectionInfo();
        console.log(`📶 Connected to: ${connectionInfo.ssid}`);
      }
    } catch (error) {
      console.error('📶 WiFi initialization failed:', error);
    }
  }

  async connectToDashboard() {
    try {
      console.log('🔗 Connecting to dashboard at:', DASHBOARD_URL);
      this.dashboardWs = new WebSocket(DASHBOARD_URL);
      
      this.dashboardWs.on('open', () => {
        console.log('🔗 Connected to dashboard');
        this.registerDevice();
        
        // Send heartbeat every 30 seconds
        this.heartbeatInterval = setInterval(() => {
          if (this.dashboardWs && this.dashboardWs.readyState === WebSocket.OPEN) {
            this.sendStatusUpdate();
          }
        }, 30000);
      });
      
      this.dashboardWs.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('📨 Received from dashboard:', message.type);
          this.handleDashboardMessage(message);
        } catch (error) {
          console.error('📨 Failed to parse dashboard message:', error);
        }
      });
      
      this.dashboardWs.on('close', () => {
        console.log('🔗 Dashboard connection closed, reconnecting in 5s...');
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
        }
        setTimeout(() => this.connectToDashboard(), 5000);
      });
      
      this.dashboardWs.on('error', (error) => {
        console.error('🔗 Dashboard connection error:', error);
        if (this.heartbeatInterval) {
          clearInterval(this.heartbeatInterval);
        }
      });
      
    } catch (error) {
      console.error('🔗 Failed to connect to dashboard:', error);
      setTimeout(() => this.connectToDashboard(), 10000);
    }
  }

  registerDevice() {
    const registration = {
      type: 'device_register',
      deviceId: this.deviceId,
      deviceInfo: this.deviceManager.getDeviceInfo(),
      status: this.status,
      timestamp: new Date().toISOString()
    };
    
    this.sendToDashboard(registration);
  }

  handleDashboardMessage(message) {
    console.log('🔄 Processing dashboard message:', message.type);
    
    switch (message.type) {
      case 'customer_assignment':
        this.customerData = message.customerData;
        console.log(`👤 Assigned to customer: ${this.customerData.fullName}`);
        break;
        
      case 'volume_update':
        console.log(`🔊 Volume update: ${message.volume}%`);
        this.audioManager.setVolume(message.volume);
        // Acknowledge the command
        this.sendToDashboard({
          type: 'command_ack',
          command: 'volume_update',
          status: 'completed',
          deviceId: this.deviceId
        });
        break;
        
      case 'mute_update':
        console.log(`🔇 Mute update: ${message.muted}`);
        this.audioManager.setMuted(message.muted);
        this.sendToDashboard({
          type: 'command_ack',
          command: 'mute_update',
          status: 'completed',
          deviceId: this.deviceId
        });
        break;
        
      case 'prayer_times_update':
        console.log('🕌 Prayer times update received');
        this.prayerScheduler.updatePrayerTimes(message.prayerTimes);
        this.sendToDashboard({
          type: 'command_ack',
          command: 'prayer_times_update',
          status: 'completed',
          deviceId: this.deviceId
        });
        break;
        
      case 'remote_maintenance':
        console.log('🔧 Entering maintenance mode');
        this.enterMaintenanceMode();
        break;
        
      case 'audio_test':
        console.log('🎵 Audio test requested');
        this.audioManager.playTestAudio().then(() => {
          this.sendToDashboard({
            type: 'command_ack',
            command: 'audio_test',
            status: 'completed',
            deviceId: this.deviceId
          });
        }).catch(error => {
          this.sendToDashboard({
            type: 'command_ack',
            command: 'audio_test',
            status: 'failed',
            error: error.message,
            deviceId: this.deviceId
          });
        });
        break;
        
      default:
        console.log('📨 Unknown message type:', message.type);
    }
  }

  sendToDashboard(message) {
    if (this.dashboardWs && this.dashboardWs.readyState === WebSocket.OPEN) {
      console.log('📤 Sending to dashboard:', message.type);
      this.dashboardWs.send(JSON.stringify(message));
    } else {
      console.log('📤 Cannot send to dashboard - connection not ready');
    }
  }

  updateStatus(newStatus) {
    if (this.status !== newStatus) {
      this.status = newStatus;
      this.sendStatusUpdate();
    }
  }

  sendStatusUpdate() {
    const statusUpdate = {
      type: 'status_update',
      deviceId: this.deviceId,
      status: this.status,
      systemInfo: this.systemMonitor.getSystemInfo(),
      timestamp: new Date().toISOString()
    };
    
    this.sendToDashboard(statusUpdate);
  }

  async playPrayer(prayerInfo) {
    try {
      console.log(`🕌 Playing ${prayerInfo.name} at ${prayerInfo.time}`);
      await this.audioManager.playPrayerAudio(prayerInfo);
      
      // Log prayer event
      const prayerEvent = {
        type: 'prayer_played',
        deviceId: this.deviceId,
        prayer: prayerInfo,
        timestamp: new Date().toISOString()
      };
      
      this.sendToDashboard(prayerEvent);
      
    } catch (error) {
      console.error('🕌 Failed to play prayer audio:', error);
    }
  }

  enterMaintenanceMode() {
    this.status = 'maintenance';
    console.log('🔧 Entering maintenance mode');
    this.sendStatusUpdate();
  }

  setupRoutes() {
    // WiFi management endpoints
    app.get('/api/wifi/scan', async (req, res) => {
      try {
        const networks = await this.wifiManager.scanNetworks();
        res.json({ networks });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/wifi/connect', async (req, res) => {
      try {
        const { ssid, password } = req.body;
        const result = await this.wifiManager.connect(ssid, password);
        res.json({ success: true, result });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Device status endpoint
    app.get('/api/status', (req, res) => {
      res.json({
        deviceId: this.deviceId,
        status: this.status,
        systemInfo: this.systemMonitor.getSystemInfo(),
        customerData: this.customerData,
        timestamp: new Date().toISOString()
      });
    });

    // Audio control endpoints
    app.post('/api/audio/volume', (req, res) => {
      try {
        const { volume } = req.body;
        this.audioManager.setVolume(volume);
        res.json({ success: true, volume });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/audio/mute', (req, res) => {
      try {
        const { muted } = req.body;
        this.audioManager.setMuted(muted);
        res.json({ success: true, muted });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.post('/api/audio/test', async (req, res) => {
      try {
        await this.audioManager.playTestAudio();
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Prayer scheduler endpoints for testing
    app.get('/api/prayers/scheduled', (req, res) => {
      try {
        const scheduled = this.prayerScheduler.getScheduledPrayers();
        const next = this.prayerScheduler.getNextPrayer();
        res.json({ 
          success: true, 
          scheduledPrayers: scheduled,
          nextPrayer: next,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Manual prayer trigger for testing
    app.post('/api/prayers/trigger', async (req, res) => {
      try {
        const { prayerName = 'Test' } = req.body;
        console.log(`📱 Manual trigger requested for: ${prayerName}`);
        
        const prayerInfo = {
          name: prayerName,
          time: new Date().toLocaleTimeString('en-US', { hour12: false }),
          manual: true,
          scheduledAt: new Date().toISOString()
        };
        
        await this.playPrayer(prayerInfo);
        
        res.json({ 
          success: true, 
          message: `${prayerName} prayer triggered`,
          prayerInfo 
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Setup page for WiFi configuration
    app.get('/', (req, res) => {
      res.sendFile('setup.html', { root: 'public' });
    });
  }
}

// Start the application
new EiXPiware();

export default EiXPiware;