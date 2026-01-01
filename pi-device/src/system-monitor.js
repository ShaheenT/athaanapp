import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class SystemMonitor {
  constructor() {
    this.monitoring = false;
    this.systemInfo = {};
    this.thresholds = {
      cpuTemp: 70, // Celsius
      diskUsage: 90, // Percentage
      memoryUsage: 90, // Percentage
      lowVoltage: 4.63 // Volts (for Raspberry Pi)
    };
    this.monitorInterval = null;
    this.statusCallback = null;
  }

  start(statusCallback) {
    if (this.monitoring) return;

    this.statusCallback = statusCallback;
    this.monitoring = true;
    
    console.log('📊 Starting system monitoring...');
    
    // Initial system check
    this.checkSystem();
    
    // Start monitoring interval (every 30 seconds)
    this.monitorInterval = setInterval(() => {
      this.checkSystem();
    }, 30000);
  }

  stop() {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.monitoring = false;
    console.log('📊 System monitoring stopped');
  }

  async checkSystem() {
    try {
      const systemInfo = await this.gatherSystemInfo();
      const status = this.evaluateSystemStatus(systemInfo);
      
      this.systemInfo = {
        ...systemInfo,
        status,
        timestamp: new Date().toISOString()
      };

      if (this.statusCallback) {
        this.statusCallback(status);
      }

    } catch (error) {
      console.error('📊 System check failed:', error);
      if (this.statusCallback) {
        this.statusCallback('error');
      }
    }
  }

  async gatherSystemInfo() {
    const info = {};

    try {
      // CPU Temperature
      const tempResult = await execAsync('cat /sys/class/thermal/thermal_zone0/temp').catch(() => ({ stdout: '0' }));
      info.cpuTemp = parseInt(tempResult.stdout.trim()) / 1000;

      // CPU Usage
      const cpuResult = await execAsync("top -bn1 | grep 'Cpu(s)' | awk '{print $2}' | cut -d'%' -f1").catch(() => ({ stdout: '0' }));
      info.cpuUsage = parseFloat(cpuResult.stdout.trim()) || 0;

      // Memory Usage
      const memResult = await execAsync("free | grep Mem | awk '{printf \"%.1f\", ($3/$2) * 100.0}'").catch(() => ({ stdout: '0' }));
      info.memoryUsage = parseFloat(memResult.stdout.trim()) || 0;

      // Disk Usage
      const diskResult = await execAsync("df / | tail -1 | awk '{printf \"%.1f\", ($3/$2) * 100.0}'").catch(() => ({ stdout: '0' }));
      info.diskUsage = parseFloat(diskResult.stdout.trim()) || 0;

      // Voltage (Raspberry Pi specific)
      const voltageResult = await execAsync('vcgencmd measure_volts core').catch(() => ({ stdout: 'volt=0V' }));
      const voltageMatch = voltageResult.stdout.match(/volt=([\d.]+)V/);
      info.voltage = voltageMatch ? parseFloat(voltageMatch[1]) : 0;

      // Uptime
      const uptimeResult = await execAsync('uptime -p').catch(() => ({ stdout: 'unknown' }));
      info.uptime = uptimeResult.stdout.trim();

      // Network connectivity
      const pingResult = await execAsync('ping -c 1 -W 5 8.8.8.8').catch(() => ({ stdout: '', stderr: 'failed' }));
      info.internetConnected = !pingResult.stderr.includes('failed');

      // Load average
      const loadResult = await execAsync("uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//'").catch(() => ({ stdout: '0' }));
      info.loadAverage = parseFloat(loadResult.stdout.trim()) || 0;

      // WiFi signal strength (if connected via WiFi)
      const wifiResult = await execAsync("iwconfig wlan0 2>/dev/null | grep 'Signal level' | awk '{print $4}' | cut -d'=' -f2").catch(() => ({ stdout: '' }));
      info.wifiSignal = wifiResult.stdout.trim() || null;

    } catch (error) {
      console.error('📊 Error gathering system info:', error);
    }

    return info;
  }

  evaluateSystemStatus(info) {
    const issues = [];

    // Check CPU temperature
    if (info.cpuTemp > this.thresholds.cpuTemp) {
      issues.push(`High CPU temperature: ${info.cpuTemp}°C`);
    }

    // Check disk usage
    if (info.diskUsage > this.thresholds.diskUsage) {
      issues.push(`High disk usage: ${info.diskUsage}%`);
    }

    // Check memory usage
    if (info.memoryUsage > this.thresholds.memoryUsage) {
      issues.push(`High memory usage: ${info.memoryUsage}%`);
    }

    // Check voltage (low voltage can cause instability)
    if (info.voltage > 0 && info.voltage < this.thresholds.lowVoltage) {
      issues.push(`Low voltage detected: ${info.voltage}V`);
    }

    // Check internet connectivity
    if (!info.internetConnected) {
      issues.push('No internet connection');
    }

    // Determine overall status
    if (issues.length === 0) {
      return 'ready';
    } else if (issues.length <= 2 && !issues.some(issue => issue.includes('temperature') || issue.includes('voltage'))) {
      console.log('📊 Minor issues detected:', issues);
      return 'ready'; // Minor issues, still operational
    } else {
      console.log('📊 System issues detected:', issues);
      return 'error';
    }
  }

  getSystemInfo() {
    return this.systemInfo;
  }

  getHealthReport() {
    const info = this.systemInfo;
    
    return {
      overall_status: info.status || 'unknown',
      checks: {
        cpu_temperature: {
          value: info.cpuTemp || 0,
          unit: '°C',
          status: (info.cpuTemp || 0) <= this.thresholds.cpuTemp ? 'good' : 'warning',
          threshold: this.thresholds.cpuTemp
        },
        disk_usage: {
          value: info.diskUsage || 0,
          unit: '%',
          status: (info.diskUsage || 0) <= this.thresholds.diskUsage ? 'good' : 'warning',
          threshold: this.thresholds.diskUsage
        },
        memory_usage: {
          value: info.memoryUsage || 0,
          unit: '%',
          status: (info.memoryUsage || 0) <= this.thresholds.memoryUsage ? 'good' : 'warning',
          threshold: this.thresholds.memoryUsage
        },
        voltage: {
          value: info.voltage || 0,
          unit: 'V',
          status: (info.voltage || 5) >= this.thresholds.lowVoltage ? 'good' : 'warning',
          threshold: this.thresholds.lowVoltage
        },
        internet: {
          status: info.internetConnected ? 'good' : 'error',
          value: info.internetConnected ? 'connected' : 'disconnected'
        }
      },
      timestamp: info.timestamp
    };
  }
}