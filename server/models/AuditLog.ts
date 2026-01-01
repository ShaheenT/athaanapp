import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: { type: String },
  action: { type: String, required: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['prayer', 'device', 'user', 'system', 'auth'], 
    required: true 
  },
  deviceId: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
