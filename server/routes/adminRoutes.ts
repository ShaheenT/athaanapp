import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { Device } from '../models/Device';
import { User } from '../models/User';
import { PrayerTime } from '../models/PrayerTime';
import { AuditLog } from '../models/AuditLog';

const router = Router();

// All admin routes require auth
router.use(authMiddleware);

// Get all devices
router.get('/devices', async (req, res) => {
  try {
    const devices = await Device.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all prayers
router.get('/prayers', async (req, res) => {
  try {
    const prayers = await PrayerTime.find().sort({ dateTime: 1 });
    res.json(prayers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
