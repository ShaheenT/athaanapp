import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class DeviceManager {
  constructor() {
    this.deviceId = null;
    this.serialNumber = null;
    this.macAddress = null;
    this.deviceInfo = {};
    this.configPath = '/etc/eix-piware';
    this.configFile = path.join(this.configPath, 'device.json');
  }

  async initialize() {
    try {
      console.log('📱 Initializing Device Manager...');
      
      // Create config directory if it doesn't exist
      if (!fs.existsSync(this.configPath)) {
        await execAsync(`sudo mkdir -p ${this.configPath}`);
        await execAsync(`sudo chmod 755 ${this.configPath}`);
      }

      // Get hardware information
      await this.gatherDeviceInfo();
      
      // Load or generate device ID
      await this.loadOrGenerateDeviceId();
      
      console.log(`📱 Device Manager initialized - ID: ${this.deviceId}`);
      
    } catch (error) {
      console.error('📱 Device Manager initialization failed:', error);
      throw error;
    }
  }

  async gatherDeviceInfo() {
    try {
      // Get CPU serial number (Raspberry Pi specific)
      const cpuInfo = await execAsync('cat /proc/cpuinfo | grep Serial').catch(() => ({ stdout: '' }));
      this.serialNumber = cpuInfo.stdout.split(':')[1]?.trim() || 'unknown';

      // Get MAC address
      const macInfo = await execAsync("cat /sys/class/net/*/address | head -1").catch(() => ({ stdout: '' }));
      this.macAddress = macInfo.stdout.trim() || 'unknown';

      // Get system information
      const osInfo = await execAsync('cat /etc/os-release').catch(() => ({ stdout: '' }));
      const kernelInfo = await execAsync('uname -r').catch(() => ({ stdout: '' }));
      const uptimeInfo = await execAsync('uptime -p').catch(() => ({ stdout: '' }));

      this.deviceInfo = {
        serialNumber: this.serialNumber,
        macAddress: this.macAddress,
        osInfo: this.parseOsRelease(osInfo.stdout),
        kernel: kernelInfo.stdout.trim(),
        uptime: uptimeInfo.stdout.trim(),
        model: await this.getRaspberryPiModel(),
        cpuTemp: await this.getCpuTemperature(),
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('📱 Failed to gather device info:', error);
    }
  }

  parseOsRelease(osReleaseContent) {
    const info = {};
    osReleaseContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        info[key] = value.replace(/"/g, '');
      }
    });
    return info;
  }

  async getRaspberryPiModel() {
    try {
      const modelInfo = await execAsync('cat /proc/device-tree/model');
      return modelInfo.stdout.trim().replace(/\0/g, '');
    } catch (error) {
      return 'Unknown Raspberry Pi';
    }
  }

  async getCpuTemperature() {
    try {
      const tempInfo = await execAsync('cat /sys/class/thermal/thermal_zone0/temp');
      const temp = parseInt(tempInfo.stdout.trim()) / 1000;
      return `${temp.toFixed(1)}°C`;
    } catch (error) {
      return 'Unknown';
    }
  }

  async loadOrGenerateDeviceId() {
    try {
      // Try to load existing device ID
      if (fs.existsSync(this.configFile)) {
        const config = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        this.deviceId = config.deviceId;
        console.log('📱 Loaded existing device ID:', this.deviceId);
        return;
      }

      // Generate new device ID based on hardware
      this.deviceId = this.generateDeviceId();
      
      // Save device configuration
      const config = {
        deviceId: this.deviceId,
        serialNumber: this.serialNumber,
        macAddress: this.macAddress,
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };

      await this.saveConfig(config);
      console.log('📱 Generated new device ID:', this.deviceId);

    } catch (error) {
      console.error('📱 Failed to load/generate device ID:', error);
      // Fallback to a simple ID based on MAC address
      this.deviceId = `EIX-${this.macAddress.replace(/:/g, '').slice(-8)}`;
    }
  }

  generateDeviceId() {
    // Create device ID from serial number and MAC address
    const baseString = `${this.serialNumber}-${this.macAddress}`;
    const hash = this.simpleHash(baseString);
    return `EIX-${hash.slice(0, 8).toUpperCase()}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  async saveConfig(config) {
    try {
      const configJson = JSON.stringify(config, null, 2);
      await execAsync(`echo '${configJson}' | sudo tee ${this.configFile}`);
      await execAsync(`sudo chmod 644 ${this.configFile}`);
    } catch (error) {
      console.error('📱 Failed to save config:', error);
    }
  }

  getDeviceId() {
    return this.deviceId;
  }

  getDeviceInfo() {
    return {
      ...this.deviceInfo,
      deviceId: this.deviceId
    };
  }

  async updateDeviceInfo() {
    await this.gatherDeviceInfo();
    return this.getDeviceInfo();
  }

  async getNetworkInterfaces() {
    try {
      const interfaces = await execAsync('ip addr show');
      return interfaces.stdout;
    } catch (error) {
      console.error('📱 Failed to get network interfaces:', error);
      return 'Unknown';
    }
  }

  async getDiskUsage() {
    try {
      const diskInfo = await execAsync('df -h /');
      return diskInfo.stdout;
    } catch (error) {
      console.error('📱 Failed to get disk usage:', error);
      return 'Unknown';
    }
  }

  async getMemoryUsage() {
    try {
      const memInfo = await execAsync('free -h');
      return memInfo.stdout;
    } catch (error) {
      console.error('📱 Failed to get memory usage:', error);
      return 'Unknown';
    }
  }
}