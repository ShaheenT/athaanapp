import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User' },
  action: { type: String, required: true },
  description: { type: String, required: true },
  entityType: { 
    type: String, 
    enum: ['user', 'device', 'prayer_times', 'audio_profile', 'technician', 'system'] 
  },
  entityId: String,
  metadata: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  severity: { 
    type: String, 
    enum: ['info', 'warning', 'error', 'critical'], 
    default: 'info' 
  },
  timestamp: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);