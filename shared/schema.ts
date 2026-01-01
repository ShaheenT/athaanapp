import { z } from "zod";

// MongoDB Schema Types (using Zod for validation)

export const insertUserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
});

export const insertCustomerProfileSchema = z.object({
  userId: z.string().optional(),
  membershipId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postalCode: z.string().optional(),
  deviceSerial: z.string().optional(),
  subscriptionStatus: z.enum(['active', 'suspended', 'cancelled']).optional(),
  accountEnabled: z.boolean().optional(),
  paymentStatus: z.enum(['current', 'overdue', 'pending']).optional(),
  lastPaymentDate: z.date().optional(),
  nextPaymentDate: z.date().optional(),
  notificationPreferences: z.object({
    emailAlerts: z.boolean().optional(),
    smsAlerts: z.boolean().optional(),
    pushNotifications: z.boolean().optional()
  }).optional(),
});

export const insertTechnicianSchema = z.object({
  employeeId: z.string().min(1),
  fullName: z.string().min(1),
  email: z.string().email(),
  phoneNumber: z.string().min(1),
  specialization: z.enum(['installation', 'maintenance', 'support']).optional(),
  status: z.enum(['active', 'inactive', 'on_leave']).optional(),
  assignedRegions: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  hireDate: z.date().optional(),
});

export const insertDeviceSchema = z.object({
  serialNumber: z.string().min(1),
  customerId: z.string().optional(),
  locationName: z.string().optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional(),
  isOnline: z.boolean().optional(),
  lastSeen: z.date().optional(),
  firmwareVersion: z.string().optional(),
  ipAddress: z.string().optional(),
  audioProfiles: z.array(z.string()).optional(),
  settings: z.object({
    volume: z.number().min(0).max(100).optional(),
    isMuted: z.boolean().optional(),
    timezone: z.string().optional()
  }).optional(),
});

export const insertPrayerTimesSchema = z.object({
  date: z.string().min(1),
  locationName: z.string().min(1),
  locationHash: z.string().optional(),
  fajrTime: z.string().min(1),
  dhuhrTime: z.string().min(1),
  asrTime: z.string().min(1),
  maghribTime: z.string().min(1),
  ishaTime: z.string().min(1),
  sunriseTime: z.string().optional(),
  sunsetTime: z.string().optional(),
  source: z.enum(['aladhan_api', 'manual_upload', 'csv_import']).optional(),
  hijriDate: z.object({
    date: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional()
  }).optional(),
});

export const insertAudioProfileSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  language: z.enum(['arabic', 'english', 'urdu']),
  reciter: z.string().optional(),
  duration: z.number().optional(),
  fileSize: z.number().optional(),
  quality: z.enum(['high', 'medium', 'low']).optional(),
  isDefault: z.boolean().optional(),
});

export const insertActivityLogSchema = z.object({
  userId: z.string().optional(),
  action: z.string().min(1),
  description: z.string().min(1),
  entityType: z.enum(['user', 'device', 'prayer_times', 'audio_profile', 'technician', 'system']).optional(),
  entityId: z.string().optional(),
  metadata: z.any().optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
  severity: z.enum(['info', 'warning', 'error', 'critical']).optional(),
});

// Type exports
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = UpsertUser & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertCustomerProfile = z.infer<typeof insertCustomerProfileSchema>;
export type CustomerProfile = InsertCustomerProfile & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertTechnician = z.infer<typeof insertTechnicianSchema>;
export type Technician = InsertTechnician & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = InsertDevice & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertPrayerTimes = z.infer<typeof insertPrayerTimesSchema>;
export type PrayerTimes = InsertPrayerTimes & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertAudioProfile = z.infer<typeof insertAudioProfileSchema>;
export type AudioProfile = InsertAudioProfile & { _id?: string; createdAt?: Date; updatedAt?: Date };

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = InsertActivityLog & { _id?: string; timestamp?: Date };