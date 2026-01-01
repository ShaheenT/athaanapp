# Raspberry Pi 5 Setup Guide for Athaan Fi Beit

## Complete Installation and Testing Guide

### Prerequisites
- Raspberry Pi 5 (8GB recommended)
- 32GB+ microSD card (Class 10 or faster)
- Bluetooth speaker
- WiFi network access
- Computer for initial setup

### Step 1: Raspberry Pi OS Installation

1. **Download Raspberry Pi Imager**
   - Download from: https://www.raspberrypi.com/software/
   - Install on your computer

2. **Flash Raspberry Pi OS**
   - Insert microSD card into computer
   - Open Raspberry Pi Imager
   - Choose "Raspberry Pi OS (64-bit)" - Full version
   - Select your microSD card
   - Click Advanced Options (gear icon)
   - Configure:
     - Enable SSH (set username: `pi`, password: `raspberry123`)
     - Configure WiFi (your network SSID and password)
     - Set locale settings (time zone, keyboard)
   - Write the image

3. **First Boot Setup**
   - Insert SD card into Raspberry Pi 5
   - Connect power cable
   - Wait for first boot (LED will stop blinking)
   - Find Pi IP address from your router's admin panel

### Step 2: Complete SSH Setup (Headless Installation)

```bash
# Connect to your Raspberry Pi
ssh pi@192.168.1.XXX  # Replace XXX with your Pi's IP
# Password: raspberry123

# First, find your Pi's IP if unknown:
# Method 1: Check your router's admin panel
# Method 2: Use network scanner: nmap -sn 192.168.1.0/24
# Method 3: Use Pi finder: https://github.com/adafruit/Adafruit-Pi-Finder

# Update system
sudo apt update && sudo apt upgrade -y

# Install all required packages for audio and IoT
sudo apt install -y nodejs npm git bluetooth bluez bluez-tools pulseaudio-utils alsa-utils ffmpeg curl wget nano

# Enable necessary services
sudo systemctl enable bluetooth
sudo systemctl enable ssh

# Configure audio system for headless operation
sudo usermod -a -G audio pi
sudo usermod -a -G bluetooth pi
```

### Step 3: Bluetooth Speaker Setup

```bash
# Enable Bluetooth
sudo systemctl enable bluetooth
sudo systemctl start bluetooth

# Make Pi discoverable
sudo bluetoothctl
# In bluetoothctl prompt:
power on
agent on
default-agent
discoverable on
pairable on

# Put your Bluetooth speaker in pairing mode, then:
scan on
# Note the MAC address of your speaker (e.g., AA:BB:CC:DD:EE:FF)
pair AA:BB:CC:DD:EE:FF
trust AA:BB:CC:DD:EE:FF
connect AA:BB:CC:DD:EE:FF
exit
```

### Step 4: Audio System Configuration

```bash
# Configure PulseAudio for Bluetooth
sudo nano /etc/pulse/system.pa
# Add these lines at the end:
load-module module-bluetooth-policy
load-module module-bluetooth-discover

# Set audio output to Bluetooth
pactl set-default-sink bluez_sink.AA_BB_CC_DD_EE_FF.a2dp_sink
# Replace AA_BB_CC_DD_EE_FF with your speaker's MAC (underscores instead of colons)

# Test audio
speaker-test -t wav -c 2
```

### Step 5: Install Athaan Fi Beit Device Software

```bash
# Create project directory
mkdir -p /home/pi/athaan-fi-beit
cd /home/pi/athaan-fi-beit

# Clone or copy the device software
# If you have the files locally, use SCP:
# scp -r ./pi-device pi@192.168.1.XXX:/home/pi/athaan-fi-beit/

# Create package.json
cat > package.json << 'EOF'
{
  "name": "athaan-fi-beit-device",
  "version": "1.0.0",
  "description": "Athaan Fi Beit Raspberry Pi Device Software",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  },
  "dependencies": {
    "ws": "^8.14.2",
    "express": "^4.18.2",
    "axios": "^1.6.0",
    "node-schedule": "^2.1.1"
  }
}
EOF

# Install dependencies
npm install
```

### Step 6: Copy Device Software

Create the main device software files:

```bash
# Create src directory
mkdir -p src

# Create main device script
cat > src/index.js << 'EOF'
const express = require('express');
const WebSocket = require('ws');
const { spawn, exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const schedule = require('node-schedule');

class AthaanDevice {
  constructor() {
    this.deviceId = 'ATH-PI-001'; // You can customize this
    this.serverUrl = 'ws://YOUR_SERVER_IP:5000'; // Replace with your server IP
    this.currentVolume = 75;
    this.isMuted = false;
    this.isPlaying = false;
    this.ws = null;
    this.app = express();
    
    this.setupExpress();
    this.connectToServer();
    this.setupPrayerSchedule();
  }

  setupExpress() {
    this.app.use(express.json());
    
    // Device status endpoint
    this.app.get('/status', (req, res) => {
      res.json({
        deviceId: this.deviceId,
        status: this.isPlaying ? 'playing' : 'idle',
        volume: this.currentVolume,
        muted: this.isMuted,
        connected: this.ws && this.ws.readyState === WebSocket.OPEN,
        timestamp: new Date().toISOString()
      });
    });

    // Manual audio test
    this.app.post('/test-audio', async (req, res) => {
      try {
        await this.playTestAudio();
        res.json({ success: true, message: 'Test audio played' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // Volume control
    this.app.post('/volume', async (req, res) => {
      const { volume } = req.body;
      if (volume >= 0 && volume <= 100) {
        await this.setVolume(volume);
        res.json({ success: true, volume: this.currentVolume });
      } else {
        res.status(400).json({ success: false, message: 'Volume must be 0-100' });
      }
    });

    this.app.listen(3000, () => {
      console.log('🌐 Device web interface running on port 3000');
    });
  }

  connectToServer() {
    try {
      console.log(`🔌 Connecting to server: ${this.serverUrl}`);
      this.ws = new WebSocket(this.serverUrl);

      this.ws.on('open', () => {
        console.log('✅ Connected to Athaan Fi Beit server');
        this.sendDeviceInfo();
      });

      this.ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString());
          console.log('📨 Received command:', message);
          await this.handleServerCommand(message);
        } catch (error) {
          console.error('❌ Error handling message:', error);
        }
      });

      this.ws.on('close', () => {
        console.log('❌ Connection to server lost. Reconnecting in 5 seconds...');
        setTimeout(() => this.connectToServer(), 5000);
      });

      this.ws.on('error', (error) => {
        console.error('❌ WebSocket error:', error.message);
        setTimeout(() => this.connectToServer(), 5000);
      });

    } catch (error) {
      console.error('❌ Connection error:', error);
      setTimeout(() => this.connectToServer(), 5000);
    }
  }

  sendDeviceInfo() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'device_register',
        deviceId: this.deviceId,
        status: 'online',
        volume: this.currentVolume,
        muted: this.isMuted,
        timestamp: new Date().toISOString()
      }));
    }
  }

  async handleServerCommand(message) {
    switch (message.type) {
      case 'play_prayer':
        await this.playPrayer(message.prayerName, message.audioFile);
        break;
      case 'set_volume':
        await this.setVolume(message.volume);
        break;
      case 'mute':
        await this.setMuted(message.muted);
        break;
      case 'test_audio':
        await this.playTestAudio();
        break;
      default:
        console.log('🤷 Unknown command type:', message.type);
    }

    // Send acknowledgment
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'ack',
        originalCommand: message.type,
        status: 'completed',
        timestamp: new Date().toISOString()
      }));
    }
  }

  async playPrayer(prayerName = 'Test Prayer', audioFile = 'default') {
    console.log(`🕌 Playing ${prayerName} prayer`);
    this.isPlaying = true;

    try {
      // Create a test tone if no audio file specified
      if (audioFile === 'default') {
        await this.playTestAudio();
      } else {
        // Play actual audio file
        await this.playAudioFile(audioFile);
      }
      
      console.log(`✅ ${prayerName} prayer completed`);
    } catch (error) {
      console.error(`❌ Error playing ${prayerName}:`, error);
    } finally {
      this.isPlaying = false;
    }
  }

  async playTestAudio() {
    return new Promise((resolve, reject) => {
      // Generate a 5-second test tone
      const command = `speaker-test -t sine -f 1000 -l 1 -s 1`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Test audio error:', error);
          reject(error);
        } else {
          console.log('🔊 Test audio played successfully');
          resolve();
        }
      });
    });
  }

  async playAudioFile(audioFile) {
    return new Promise((resolve, reject) => {
      // Use aplay to play audio file
      const command = `aplay ${audioFile}`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Audio playback error:', error);
          reject(error);
        } else {
          console.log('🔊 Audio file played successfully');
          resolve();
        }
      });
    });
  }

  async setVolume(volume) {
    this.currentVolume = Math.max(0, Math.min(100, volume));
    
    return new Promise((resolve, reject) => {
      // Set system volume using amixer
      const command = `amixer set Master ${this.currentVolume}%`;
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Volume control error:', error);
          reject(error);
        } else {
          console.log(`🔊 Volume set to ${this.currentVolume}%`);
          resolve();
        }
      });
    });
  }

  async setMuted(muted) {
    this.isMuted = muted;
    
    return new Promise((resolve, reject) => {
      const command = muted ? 'amixer set Master mute' : 'amixer set Master unmute';
      
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error('❌ Mute control error:', error);
          reject(error);
        } else {
          console.log(`🔇 Audio ${muted ? 'muted' : 'unmuted'}`);
          resolve();
        }
      });
    });
  }

  setupPrayerSchedule() {
    // Example: Schedule test prayer every 30 seconds for demo
    schedule.scheduleJob('*/30 * * * * *', () => {
      console.log('⏰ Scheduled prayer time demo');
      // Uncomment to test automatic prayers
      // this.playPrayer('Scheduled Test Prayer');
    });
  }
}

// Start the device
console.log('🚀 Starting Athaan Fi Beit Device...');
const device = new AthaanDevice();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down Athaan Fi Beit Device...');
  if (device.ws) {
    device.ws.close();
  }
  process.exit(0);
});
EOF

# Make sure to replace YOUR_SERVER_IP with your actual server IP
sed -i 's/YOUR_SERVER_IP/YOUR_ACTUAL_SERVER_IP_HERE/g' src/index.js
```

### Step 7: Create Audio Test Files

```bash
# Create audio directory
mkdir -p audio

# Create a simple test audio file (sine wave)
cat > create_test_audio.sh << 'EOF'
#!/bin/bash
# Create test audio files
ffmpeg -f lavfi -i "sine=frequency=800:duration=3" -ac 1 -ar 22050 audio/test-athaan.wav
ffmpeg -f lavfi -i "sine=frequency=600:duration=2" -ac 1 -ar 22050 audio/fajr.wav
ffmpeg -f lavfi -i "sine=frequency=700:duration=2" -ac 1 -ar 22050 audio/dhuhr.wav
ffmpeg -f lavfi -i "sine=frequency=750:duration=2" -ac 1 -ar 22050 audio/asr.wav
ffmpeg -f lavfi -i "sine=frequency=650:duration=2" -ac 1 -ar 22050 audio/maghrib.wav
ffmpeg -f lavfi -i "sine=frequency=550:duration=2" -ac 1 -ar 22050 audio/isha.wav
echo "Test audio files created!"
EOF

chmod +x create_test_audio.sh

# Install ffmpeg if needed
sudo apt install -y ffmpeg
./create_test_audio.sh
```

### Step 8: Configure as System Service

```bash
# Create systemd service
sudo tee /etc/systemd/system/athaan-fi-beit.service > /dev/null << 'EOF'
[Unit]
Description=Athaan Fi Beit Device Service
After=network.target bluetooth.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/athaan-fi-beit
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable athaan-fi-beit
sudo systemctl start athaan-fi-beit

# Check status
sudo systemctl status athaan-fi-beit
```

### Step 9: Testing from Admin Dashboard

1. **Update Server IP**
   - Edit `src/index.js` on the Pi
   - Replace `YOUR_ACTUAL_SERVER_IP_HERE` with your actual server IP
   - Restart the service: `sudo systemctl restart athaan-fi-beit`

2. **Test from Admin Dashboard**
   - Go to your admin dashboard: `http://YOUR_SERVER_IP:5000/demo`
   - Navigate to Devices page
   - You should see device `ATH-PI-001` listed
   - Click "Trigger Prayer" button
   - The Raspberry Pi should play audio through the Bluetooth speaker

3. **Volume Control Test**
   - Use volume controls in admin dashboard
   - Verify volume changes on the Pi
   - Test mute/unmute functionality

### Step 10: iPhone PWA Testing

1. **Access PWA on iPhone**
   - Open Safari on your iPhone
   - Go to: `http://YOUR_SERVER_IP:5000/customer`
   - Tap Share button → "Add to Home Screen"
   - App will appear as "Athaan Fi Beit" on home screen

2. **Test PWA Features**
   - Open the PWA app
   - View current prayer times
   - Test volume controls
   - Test mute/unmute while audio is playing
   - Verify offline functionality

### Troubleshooting

1. **Bluetooth Issues**
   ```bash
   # Restart Bluetooth service
   sudo systemctl restart bluetooth
   
   # Check connected devices
   bluetoothctl info
   
   # Reconnect speaker
   bluetoothctl connect AA:BB:CC:DD:EE:FF
   ```

2. **Audio Issues**
   ```bash
   # List audio devices
   pactl list sinks short
   
   # Set default audio output
   pactl set-default-sink SINK_NAME
   
   # Test audio
   aplay /usr/share/sounds/alsa/Front_Left.wav
   ```

3. **Service Issues**
   ```bash
   # Check service logs
   sudo journalctl -u athaan-fi-beit -f
   
   # Restart service
   sudo systemctl restart athaan-fi-beit
   ```

4. **Network Issues**
   ```bash
   # Check Pi IP address
   ip addr show wlan0
   
   # Test server connection
   curl http://YOUR_SERVER_IP:5000/api/dashboard/stats
   ```

### Real-time Testing Commands

```bash
# On Raspberry Pi - manual tests
curl -X POST http://localhost:3000/test-audio
curl -X POST http://localhost:3000/volume -H "Content-Type: application/json" -d '{"volume": 50}'

# From your computer - test Pi remotely
curl -X POST http://PI_IP_ADDRESS:3000/test-audio
curl http://PI_IP_ADDRESS:3000/status
```

### Expected Behavior for Today's Test

1. **Admin Dashboard → Raspberry Pi**
   - Click "Trigger Prayer" in admin dashboard
   - Pi receives WebSocket command
   - Pi plays audio through Bluetooth speaker
   - Dashboard shows real-time volume control

2. **iPhone PWA → Raspberry Pi**
   - Change volume on PWA app
   - Pi receives volume change command via server
   - Audio volume changes in real-time
   - Mute/unmute works instantly

3. **Real-time Features**
   - WebSocket connection between Pi and server
   - Instant command transmission
   - Live status updates
   - Remote volume/mute control

This setup will give you a fully functional demonstration of the Athaan Fi Beit system with real hardware integration!