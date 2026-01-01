import mongoose from "mongoose";

const customerProfileSchema = new mongoose.Schema({
  userId: { type: String, ref: 'User', required: true },
  membershipId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: String,
  address: String,
  city: String,
  province: String,
  postalCode: String,
  deviceSerial: String,
  subscriptionStatus: { 
    type: String, 
    enum: ['active', 'suspended', 'cancelled'], 
    default: 'active' 
  },
  accountEnabled: { type: Boolean, default: true },
  paymentStatus: { 
    type: String, 
    enum: ['current', 'overdue', 'pending'], 
    default: 'current' 
  },
  lastPaymentDate: Date,
  nextPaymentDate: Date,
  notificationPreferences: {
    emailAlerts: { type: Boolean, default: true },
    smsAlerts: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const CustomerProfile = mongoose.model("CustomerProfile", customerProfileSchema);