# EiX-piware - Athaan Fi Beit Device Software

Smart Raspberry Pi device software for automated Islamic prayer calls with dashboard integration.

## Features

### 🌐 Auto WiFi Setup
- Automatic WiFi detection and connection
- Access Point mode for easy setup by technicians
- Web-based configuration interface
- No technical knowledge required for installation

### 🔊 Audio Management
- High-quality prayer call playback
- Volume control with remote adjustment
- Mute functionality
- Audio file management

### 📊 Real-time Monitoring
- System health monitoring (CPU, memory, temperature)
- Network connectivity status
- Remote diagnostics and support
- Status reporting to admin dashboard

### 🕌 Prayer Scheduling
- Automatic prayer time scheduling
- Real-time prayer call delivery
- Customizable prayer times per location
- Manual prayer triggers for testing

### 🔧 Remote Management
- Dashboard integration via WebSocket
- Remote volume and mute control
- Maintenance mode for support
- Automatic status updates (green/amber/red)

## Installation

### Prerequisites
- Raspberry Pi 3B+ or newer
- Raspbian OS Lite or Desktop
- Internet connection (Ethernet or WiFi)
- Audio output (3.5mm jack or USB speakers)

### Quick Setup

1. **Download and extract EiX-piware to Raspberry Pi:**
```bash
cd /home/pi
sudo apt update && sudo apt install -y nodejs npm git
git clone <repository-url> eix-piware
cd eix-piware
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install system dependencies:**
```bash
sudo apt install -y hostapd dnsmasq alsa-utils sox
```

4. **Install as system service:**
```bash
npm run install-service
```

5. **Start the service:**
```bash
sudo systemctl start eix-piware
sudo systemctl status eix-piware
```

## Technician Setup Process

### 1. Power On Device
- Connect Raspberry Pi to power supply
- Wait 2-3 minutes for boot up
- Device will create "EiX-Setup" WiFi network if no internet connection

### 2. WiFi Configuration
- Connect phone/laptop to "EiX-Setup" network
- Password: `eixsetup123`
- Open browser and go to `192.168.4.1`
- Scan and select customer's WiFi network
- Enter WiFi password and connect

### 3. Verification
- Device will automatically connect to dashboard
- Green status = Ready
- Amber status = Minor issues, still working
- Red status = Critical issues, needs support

### 4. Complete Installation
- Place device in optimal location for audio
- Connect to power (USB-C) and audio output
- Test prayer call volume with customer
- Provide customer with volume control instructions

## Dashboard Integration

### Device Status Colors
- 🟢 **Green**: Device online and healthy
- 🟡 **Amber**: Device online with minor issues or in maintenance mode
- 🔴 **Red**: Device offline or critical system issues

### Remote Support Features
- Real-time system monitoring
- Remote volume adjustment
- Audio testing capabilities
- Maintenance mode activation
- System diagnostics and logs

## API Endpoints

### Device Status
```
GET /api/status
```

### WiFi Management
```
GET /api/wifi/scan          # Scan for networks
POST /api/wifi/connect      # Connect to network
```

### Audio Control
```
POST /api/audio/volume      # Set volume (0-100)
POST /api/audio/mute        # Mute/unmute
POST /api/audio/test        # Play test audio
```

## Configuration

### Environment Variables
- `DASHBOARD_URL`: WebSocket URL for dashboard connection
- `NODE_ENV`: Environment mode (development/production)

### Prayer Times
Prayer times are automatically synchronized from the dashboard based on device location and customer settings.

### Audio Files
Place prayer audio files in `/home/pi/eix-piware/audio/`:
- `fajr.wav` - Fajr prayer call
- `dhuhr.wav` - Dhuhr prayer call  
- `asr.wav` - Asr prayer call
- `maghrib.wav` - Maghrib prayer call
- `isha.wav` - Isha prayer call
- `test-audio.wav` - Test audio file

## Troubleshooting

### Device Won't Connect to WiFi
1. Check WiFi credentials are correct
2. Ensure router supports 2.4GHz (Pi may not support 5GHz)
3. Check if MAC address filtering is enabled on router
4. Try restarting device

### No Audio Output
1. Check audio cable connections
2. Verify volume is not muted
3. Test with: `aplay /usr/share/sounds/alsa/Front_Left.wav`
4. Check ALSA mixer settings: `alsamixer`

### Device Shows Red Status
1. Check power supply (use official Pi adapter)
2. Verify internet connection
3. Check system logs: `sudo journalctl -u eix-piware -f`
4. Monitor system resources: `htop`

### Dashboard Connection Issues
1. Verify DASHBOARD_URL is correct
2. Check firewall settings
3. Test internet connectivity: `ping 8.8.8.8`
4. Check WebSocket connection in logs

## Support

For technical support and remote assistance:
1. Device automatically reports status to admin dashboard
2. Support team can access device remotely when needed
3. System logs are available for diagnostics
4. Maintenance mode allows safe remote troubleshooting

## Security

- Device runs with minimal privileges
- No SSH access enabled by default
- Only required ports are open
- Automatic security updates
- Encrypted communication with dashboard