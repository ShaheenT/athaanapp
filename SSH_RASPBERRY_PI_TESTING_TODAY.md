# SSH Raspberry Pi Setup for TODAY'S TESTING

## Quick 30-Minute Setup for Immediate Testing

### Step 1: SSH Connection and Basic Setup

```bash
# Connect to your Raspberry Pi via SSH
ssh pi@192.168.1.XXX  # Replace with your Pi's IP
# Default password: raspberry

# Quick system update
sudo apt update

# Install essential packages in one command
sudo apt install -y nodejs npm bluetooth bluez alsa-utils pulseaudio curl wget

# Quick Node.js version check
node --version  # Should show v18+ or v20+
```

### Step 2: Bluetooth Speaker Setup (5 minutes)

```bash
# Start Bluetooth service
sudo systemctl start bluetooth

# Quick Bluetooth setup
sudo bluetoothctl << 'EOF'
power on
agent on
default-agent
discoverable on
scan on
EOF

# Put your Bluetooth speaker in pairing mode now!
# Note the speaker's MAC address (e.g., AA:BB:CC:DD:EE:FF)

# Pair and connect (replace MAC address)
sudo bluetoothctl << 'EOF'
pair AA:BB:CC:DD:EE:FF
trust AA:BB:CC:DD:EE:FF
connect AA:BB:CC:DD:EE:FF
exit
EOF

# Test audio quickly
echo "Testing audio..."
speaker-test -t wav -c 2 -l 1
```

### Step 3: Install Athaan Device Software (10 minutes)

```bash
# Create project directory
mkdir -p /home/pi/athaan-device
cd /home/pi/athaan-device

# Create package.json
cat > package.json << 'EOF'
{
  "name": "athaan-device",
  "version": "1.0.0",
  "main": "device.js",
  "dependencies": {
    "ws": "^8.14.2",
    "express": "^4.18.2"
  }
}
EOF

# Install dependencies
npm install
```

### Step 4: Create Device Software (Copy-Paste Ready)

```bash
# Create the main device script
cat > device.js << 'EOF'
const express = require('express');
const WebSocket = require('ws');
const { exec } = require('child_process');

class AthaanDevice {
  constructor() {
    this.deviceId = 'ATH-PI-001';
    this.serverUrl = 'ws://REPLACE_WITH_YOUR_SERVER_IP:5000';
    this.volume = 75;
    this.isMuted = false;
    this.isPlaying = false;
    
    console.log('🚀 Starting Athaan Device...');
    this.setupWebInterface();
    this.connectToServer();
  }

  setupWebInterface() {
    const app = express();
    app.use(express.json());

    app.get('/status', (req, res) => {
      res.json({
        deviceId: this.deviceId,
        volume: this.volume,
        muted: this.isMuted,
        playing: this.isPlaying,
        timestamp: new Date().toISOString()
      });
    });

    app.post('/test', async (req, res) => {
      console.log('🔊 Playing test audio...');
      await this.playTestAudio();
      res.json({ success: true, message: 'Test audio played' });
    });

    app.post('/volume', async (req, res) => {
      const { volume } = req.body;
      await this.setVolume(volume);
      res.json({ success: true, volume: this.volume });
    });

    app.listen(3000, () => {
      console.log('🌐 Device interface running on port 3000');
      console.log('📍 Test URL: http://RASPBERRY_PI_IP:3000/status');
    });
  }

  connectToServer() {
    console.log(`🔌 Connecting to: ${this.serverUrl}`);
    
    try {
      this.ws = new WebSocket(this.serverUrl);

      this.ws.on('open', () => {
        console.log('✅ Connected to Athaan Fi Beit server');
        this.sendStatus();
      });

      this.ws.on('message', async (data) => {
        const message = JSON.parse(data.toString());
        console.log('📨 Received:', message.type);
        await this.handleCommand(message);
      });

      this.ws.on('close', () => {
        console.log('❌ Disconnected. Reconnecting in 5 seconds...');
        setTimeout(() => this.connectToServer(), 5000);
      });

      this.ws.on('error', (error) => {
        console.log('❌ Connection error. Retrying...');
        setTimeout(() => this.connectToServer(), 5000);
      });

    } catch (error) {
      console.log('❌ Failed to connect. Retrying in 5 seconds...');
      setTimeout(() => this.connectToServer(), 5000);
    }
  }

  sendStatus() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'device_status',
        deviceId: this.deviceId,
        volume: this.volume,
        muted: this.isMuted,
        playing: this.isPlaying
      }));
    }
  }

  async handleCommand(message) {
    switch (message.type) {
      case 'play_prayer':
        await this.playPrayer(message.prayerName);
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
    }

    // Send acknowledgment
    this.sendStatus();
  }

  async playPrayer(prayerName = 'Test Prayer') {
    console.log(`🕌 Playing: ${prayerName}`);
    this.isPlaying = true;
    
    // Play a 3-second beep for testing
    await this.executeCommand('speaker-test -t sine -f 800 -l 1 -s 1');
    
    this.isPlaying = false;
    console.log(`✅ Completed: ${prayerName}`);
  }

  async playTestAudio() {
    console.log('🔊 Playing test audio');
    this.isPlaying = true;
    
    // 2-second test beep
    await this.executeCommand('speaker-test -t sine -f 1000 -l 1 -s 1');
    
    this.isPlaying = false;
    console.log('✅ Test audio completed');
  }

  async setVolume(volume) {
    this.volume = Math.max(0, Math.min(100, volume));
    console.log(`🔊 Volume set to: ${this.volume}%`);
    
    // Set system volume
    await this.executeCommand(`amixer set Master ${this.volume}%`);
  }

  async setMuted(muted) {
    this.isMuted = muted;
    console.log(`🔇 ${muted ? 'Muted' : 'Unmuted'}`);
    
    const command = muted ? 'amixer set Master mute' : 'amixer set Master unmute';
    await this.executeCommand(command);
  }

  executeCommand(command) {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Command error: ${error.message}`);
          reject(error);
        } else {
          resolve(stdout);
        }
      });
    });
  }
}

// Start the device
new AthaanDevice();
EOF

# IMPORTANT: Replace with your actual server IP
echo ""
echo "⚠️  IMPORTANT: Edit the server IP in device.js"
echo "Run: nano device.js"
echo "Replace 'REPLACE_WITH_YOUR_SERVER_IP' with your actual server IP"
echo ""
```

### Step 5: Quick Test Before Starting

```bash
# Test Node.js script syntax
node -c device.js

# Test audio system
speaker-test -t wav -c 2 -l 1

# Test Bluetooth connection
bluetoothctl info | grep "Connected: yes"
```

### Step 6: Start the Device

```bash
# Method 1: Run directly for testing
node device.js

# Method 2: Run in background
nohup node device.js > device.log 2>&1 &

# Check if running
ps aux | grep node
```

### Step 7: Test from Your Computer

```bash
# Test device status (replace PI_IP with your Pi's IP)
curl http://PI_IP:3000/status

# Test audio remotely
curl -X POST http://PI_IP:3000/test

# Test volume control
curl -X POST http://PI_IP:3000/volume -H "Content-Type: application/json" -d '{"volume": 50}'
```

### Step 8: Admin Dashboard Testing

1. **Open Admin Dashboard**
   ```
   http://YOUR_SERVER_IP:5000/demo
   ```

2. **Go to Devices Page**
   - Should show device ATH-PI-001
   - Status should be "online"

3. **Test Prayer Trigger**
   - Click "Trigger Prayer" button
   - Pi should play audio through Bluetooth speaker
   - Check console logs on Pi: `tail -f device.log`

4. **Test Volume Control**
   - Use volume slider in dashboard
   - Verify volume changes on Pi
   - Test mute/unmute buttons

### Step 9: iPhone PWA Testing

1. **Access PWA**
   ```
   http://YOUR_SERVER_IP:5000/customer
   ```

2. **Add to Home Screen**
   - Safari → Share → Add to Home Screen
   - App appears as "Athaan Fi Beit"

3. **Test Real-time Controls**
   - Change volume while audio is playing
   - Test mute/unmute during prayer
   - Verify instant response

### Real-time Testing Commands

```bash
# On Pi - Monitor logs in real-time
tail -f device.log

# On Pi - Manual audio test
curl -X POST http://localhost:3000/test

# From your computer - Remote control
curl -X POST http://PI_IP:3000/volume -H "Content-Type: application/json" -d '{"volume": 80}'

# Check Pi status from anywhere
curl http://PI_IP:3000/status
```

### Expected Testing Flow for Today

1. **Setup (30 minutes)**
   - SSH into Pi
   - Install software
   - Pair Bluetooth speaker
   - Start device service

2. **Basic Tests (10 minutes)**
   - Audio output verification
   - WebSocket connection
   - Volume controls

3. **Dashboard Integration (15 minutes)**
   - Admin triggers prayer
   - Real-time volume control
   - Device status monitoring

4. **PWA Mobile Test (15 minutes)**
   - iPhone app installation
   - Mobile volume controls
   - Real-time audio control

### Troubleshooting Quick Fixes

```bash
# Audio not working
sudo systemctl restart bluetooth
bluetoothctl connect YOUR_SPEAKER_MAC

# Device not connecting
# Edit device.js and fix server IP
nano device.js

# Service issues
pkill node
node device.js

# Permission issues
sudo chown -R pi:pi /home/pi/athaan-device
```

### Success Indicators

✅ **Pi Console Shows:**
- "Connected to Athaan Fi Beit server"
- "Device interface running on port 3000"

✅ **Admin Dashboard Shows:**
- Device ATH-PI-001 online
- Real-time status updates

✅ **Audio Tests Pass:**
- Bluetooth speaker plays test tones
- Volume controls work
- Mute/unmute functions

✅ **PWA Works:**
- Installs on iPhone
- Controls work in real-time
- Offline capabilities function

This setup will have your Athaan Fi Beit system fully operational for testing within 1 hour!