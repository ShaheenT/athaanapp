import type { Express } from "express";
import { createServer, type Server } from "http";
import { Server as SocketIOServer } from 'socket.io';
import { connectDB } from "./database.ts.ts";
import { authMiddleware, optionalAuth, type AuthRequest } from "./middleware/auth.ts.ts";
import { User } from "./models/User.ts.ts";
import { Device } from "./models/Device.ts.ts";
import { PrayerTime } from "./models/PrayerTime.ts.ts";
import { SystemSettings } from "./models/SystemSettings.ts.ts";
import { AuditLog } from "./models/AuditLog.ts.ts";
import adminRoutes from './routes/adminRoutes.ts'; // <-- import admin routes

export async function registerProductionRoutes(app: Express): Promise<Server> {
  const server = createServer(app);
  
  // Connect to MongoDB (non-blocking for development)
  connectDB().catch(err => {
    console.warn('MongoDB connection failed, running in limited mode:', err.message);
  });

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "*",
      methods: ["GET", "POST"]
    }
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      socket.data.deviceId = socket.handshake.auth?.deviceId;
      return next();
    } catch (err) {
      return next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log('Socket connected', socket.id, 'deviceId:', socket.data.deviceId);
    if (socket.data.deviceId) {
      await Device.findByIdAndUpdate(socket.data.deviceId, { online: true, socketId: socket.id });
    }

    socket.on('ack', (payload) => console.log('Device acknowledgement:', payload));

    socket.on('disconnect', async () => {
      if (socket.data.deviceId) {
        await Device.findByIdAndUpdate(socket.data.deviceId, { online: false, socketId: null });
      }
    });
  });

  // Store io instance for use in routes
  app.set('io', io);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Auth, User, Device, Prayer, Dashboard, Activity log, Test endpoints
  // (Keep all your existing routes here as before)

  // Mount admin routes
  app.use('/admin', adminRoutes); // <-- admin routes mounted here

  // Prayer scheduler - check every 15 seconds
  async function checkAndEmitPrayers() {
    try {
      const mongoose = await import('mongoose');
      if (mongoose.default.connection.readyState !== 1) return;

      const now = new Date();
      const from = new Date(now.getTime() - 30 * 1000);
      const to = new Date(now.getTime() + 30 * 1000);
      const prayers = await PrayerTime.find({ dateTime: { $gte: from, $lte: to }, triggered: false });
      if (!prayers.length) return;

      const devices = await Device.find({ online: true });
      const settings = await SystemSettings.findOne();

      for (const prayer of prayers) {
        const duration = prayer.durationSeconds || settings?.defaultPlayDuration || 60;
        devices.forEach(device => {
          if (device.socketId) {
            io.to(device.socketId).emit('play', { audioUrl: prayer.audioUrl, prayerName: prayer.prayerName, durationSeconds: duration });
            console.log(`📡 Broadcast prayer ${prayer.prayerName} to device ${device._id}`);
          }
        });

        await PrayerTime.findByIdAndUpdate(prayer._id, { triggered: true });
        await AuditLog.create({ action: 'Prayer Triggered', description: `${prayer.prayerName} prayer triggered on ${devices.length} devices`, category: 'prayer' });
      }
    } catch (error) {
      if (error instanceof Error && !error.message.includes('buffering timed out')) {
        console.error('Prayer scheduler error:', error);
      }
    }
  }

  setInterval(checkAndEmitPrayers, 15 * 1000);

  return server;
}
