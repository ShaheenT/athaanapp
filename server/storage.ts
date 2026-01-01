import { User } from "./models/User.ts.ts";
import { CustomerProfile } from "./models/CustomerProfile.ts.ts";
import { Device } from "./models/Device.ts.ts";
import { PrayerTimes } from "./models/PrayerTimes.ts.ts";
import { AudioProfile } from "./models/AudioProfile.ts.ts";
import { Technician } from "./models/Technician.ts.ts";
import { ActivityLog } from "./models/ActivityLog.ts.ts";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<any | undefined>;
  upsertUser(user: any): Promise<any>;
  
  // Customer Profile operations
  getCustomerProfile(userId: string): Promise<any | undefined>;
  getCustomerProfiles(): Promise<any[]>;
  getCustomerProfileByEmail(email: string): Promise<any | undefined>;
  getCustomerProfileByMembershipId(membershipId: string): Promise<any | undefined>;
  createCustomerProfile(profile: any): Promise<any>;
  updateCustomerProfile(id: string, profile: any): Promise<any>;
  updateCustomerAccountStatus(id: string, accountEnabled: boolean): Promise<any>;
  deleteCustomerProfile(id: string): Promise<void>;
  getCustomerProfilesCount(): Promise<number>;
  
  // Technician operations
  getTechnicians(): Promise<any[]>;
  createTechnician(technician: any): Promise<any>;
  updateTechnician(id: string, technician: any): Promise<any>;
  deleteTechnician(id: string): Promise<void>;
  
  // Device operations
  getDevices(): Promise<any[]>;
  getDevice(id: string): Promise<any | undefined>;
  getDeviceBySerial(serialNumber: string): Promise<any | undefined>;
  createDevice(device: any): Promise<any>;
  updateDevice(id: string, device: any): Promise<any>;
  deleteDevice(id: string): Promise<void>;
  updateDeviceStatus(id: string, isOnline: boolean, lastSeen?: Date): Promise<void>;
  getOnlineDevicesCount(): Promise<number>;
  getDevicesWithCustomers(): Promise<any[]>;
  
  // Prayer Times operations
  getPrayerTimes(date: string, locationHash?: string): Promise<any[]>;
  createPrayerTimes(prayerTimes: any): Promise<any>;
  updatePrayerTimes(id: string, prayerTimes: any): Promise<any>;
  deletePrayerTimes(id: string): Promise<void>;
  getTodaysPrayerTimes(locationName: string): Promise<any | undefined>;
  
  // Audio Profile operations
  getAudioProfiles(): Promise<any[]>;
  createAudioProfile(audioProfile: any): Promise<any>;
  updateAudioProfile(id: string, audioProfile: any): Promise<any>;
  deleteAudioProfile(id: string): Promise<void>;
  
  // Activity Log operations
  getActivityLogs(limit?: number): Promise<any[]>;
  createActivityLog(activityLog: any): Promise<any>;
  
  // Dashboard stats
  getDashboardStats(): Promise<{
    totalUsers: number;
    activeDevices: number;
    totalDevices: number;
    nextPrayer: { name: string; time: string } | null;
  }>;
}

export class MongoDBStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<any | undefined> {
    return await User.findOne({ id });
  }

  async upsertUser(userData: any): Promise<any> {
    return await User.findOneAndUpdate(
      { id: userData.id },
      { ...userData, updatedAt: new Date() },
      { upsert: true, new: true }
    );
  }

  // Customer Profile operations
  async getCustomerProfile(userId: string): Promise<any | undefined> {
    return await CustomerProfile.findOne({ userId }).populate('userId');
  }

  async getCustomerProfiles(): Promise<any[]> {
    return await CustomerProfile.find().populate('userId').sort({ createdAt: -1 });
  }

  async getCustomerProfileByEmail(email: string): Promise<any | undefined> {
    return await CustomerProfile.findOne({ email }).populate('userId');
  }

  async getCustomerProfileByMembershipId(membershipId: string): Promise<any | undefined> {
    return await CustomerProfile.findOne({ membershipId }).populate('userId');
  }

  async createCustomerProfile(profile: any): Promise<any> {
    const newProfile = new CustomerProfile(profile);
    return await newProfile.save();
  }

  async updateCustomerProfile(id: string, profile: any): Promise<any> {
    return await CustomerProfile.findByIdAndUpdate(
      id,
      { ...profile, updatedAt: new Date() },
      { new: true }
    ).populate('userId');
  }

  async updateCustomerAccountStatus(id: string, accountEnabled: boolean): Promise<any> {
    return await CustomerProfile.findByIdAndUpdate(
      id,
      { accountEnabled, updatedAt: new Date() },
      { new: true }
    ).populate('userId');
  }

  async deleteCustomerProfile(id: string): Promise<void> {
    await CustomerProfile.findByIdAndDelete(id);
  }

  async getCustomerProfilesCount(): Promise<number> {
    return await CustomerProfile.countDocuments();
  }

  // Technician operations
  async getTechnicians(): Promise<any[]> {
    return await Technician.find().sort({ createdAt: -1 });
  }

  async createTechnician(technician: any): Promise<any> {
    const newTechnician = new Technician(technician);
    return await newTechnician.save();
  }

  async updateTechnician(id: string, technician: any): Promise<any> {
    return await Technician.findByIdAndUpdate(
      id,
      { ...technician, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteTechnician(id: string): Promise<void> {
    await Technician.findByIdAndDelete(id);
  }

  // Device operations
  async getDevices(): Promise<any[]> {
    return await Device.find().populate('customerId').populate('audioProfiles').sort({ createdAt: -1 });
  }

  async getDevice(id: string): Promise<any | undefined> {
    return await Device.findById(id).populate('customerId').populate('audioProfiles');
  }

  async getDeviceBySerial(serialNumber: string): Promise<any | undefined> {
    return await Device.findOne({ serialNumber }).populate('customerId').populate('audioProfiles');
  }

  async createDevice(device: any): Promise<any> {
    const newDevice = new Device(device);
    return await newDevice.save();
  }

  async updateDevice(id: string, device: any): Promise<any> {
    return await Device.findByIdAndUpdate(
      id,
      { ...device, updatedAt: new Date() },
      { new: true }
    ).populate('customerId').populate('audioProfiles');
  }

  async deleteDevice(id: string): Promise<void> {
    await Device.findByIdAndDelete(id);
  }

  async updateDeviceStatus(id: string, isOnline: boolean, lastSeen?: Date): Promise<void> {
    await Device.findByIdAndUpdate(id, {
      isOnline,
      lastSeen: lastSeen || new Date(),
      updatedAt: new Date()
    });
  }

  async getOnlineDevicesCount(): Promise<number> {
    return await Device.countDocuments({ isOnline: true });
  }

  async getDevicesWithCustomers(): Promise<any[]> {
    return await Device.find().populate('customerId');
  }

  // Prayer Times operations
  async getPrayerTimes(date: string, locationHash?: string): Promise<any[]> {
    const filter: any = { date };
    if (locationHash) {
      filter.locationHash = locationHash;
    }
    return await PrayerTimes.find(filter).sort({ date: -1 });
  }

  async createPrayerTimes(prayerTimesData: any): Promise<any> {
    const newPrayerTimes = new PrayerTimes(prayerTimesData);
    return await newPrayerTimes.save();
  }

  async updatePrayerTimes(id: string, prayerTimesData: any): Promise<any> {
    return await PrayerTimes.findByIdAndUpdate(
      id,
      { ...prayerTimesData, updatedAt: new Date() },
      { new: true }
    );
  }

  async deletePrayerTimes(id: string): Promise<void> {
    await PrayerTimes.findByIdAndDelete(id);
  }

  async getTodaysPrayerTimes(locationName: string): Promise<any | undefined> {
    const today = new Date().toISOString().split('T')[0];
    return await PrayerTimes.findOne({ 
      date: today, 
      locationName: new RegExp(locationName, 'i') 
    });
  }

  // Audio Profile operations
  async getAudioProfiles(): Promise<any[]> {
    return await AudioProfile.find().sort({ createdAt: -1 });
  }

  async createAudioProfile(audioProfile: any): Promise<any> {
    const newAudioProfile = new AudioProfile(audioProfile);
    return await newAudioProfile.save();
  }

  async updateAudioProfile(id: string, audioProfile: any): Promise<any> {
    return await AudioProfile.findByIdAndUpdate(
      id,
      { ...audioProfile, updatedAt: new Date() },
      { new: true }
    );
  }

  async deleteAudioProfile(id: string): Promise<void> {
    await AudioProfile.findByIdAndDelete(id);
  }

  // Activity Log operations
  async getActivityLogs(limit: number = 50): Promise<any[]> {
    return await ActivityLog.find()
      .populate('userId')
      .sort({ timestamp: -1 })
      .limit(limit);
  }

  async createActivityLog(activityLog: any): Promise<any> {
    const newActivityLog = new ActivityLog(activityLog);
    return await newActivityLog.save();
  }

  // Dashboard stats
  async getDashboardStats(): Promise<{
    totalUsers: number;
    activeDevices: number;
    totalDevices: number;
    nextPrayer: { name: string; time: string } | null;
  }> {
    const [totalUsers, activeDevices, totalDevices] = await Promise.all([
      CustomerProfile.countDocuments(),
      Device.countDocuments({ isOnline: true }),
      Device.countDocuments()
    ]);

    // Get next prayer time
    const today = new Date().toISOString().split('T')[0];
    const todaysPrayerTimes = await PrayerTimes.findOne({ date: today });
    
    let nextPrayer = null;
    if (todaysPrayerTimes) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      const prayers = [
        { name: 'Fajr', time: todaysPrayerTimes.fajrTime },
        { name: 'Dhuhr', time: todaysPrayerTimes.dhuhrTime },
        { name: 'Asr', time: todaysPrayerTimes.asrTime },
        { name: 'Maghrib', time: todaysPrayerTimes.maghribTime },
        { name: 'Isha', time: todaysPrayerTimes.ishaTime }
      ];
      
      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;
        if (prayerTime > currentTime) {
          nextPrayer = prayer;
          break;
        }
      }
    }

    return {
      totalUsers,
      activeDevices,
      totalDevices,
      nextPrayer
    };
  }
}

export const storage = new MongoDBStorage();