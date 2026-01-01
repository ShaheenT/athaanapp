#!/bin/bash

# EiX-piware Installation Script
# Athaan Fi Beit - Raspberry Pi Device Setup

set -e

echo "🌙 Installing EiX-piware - Athaan Fi Beit Device Software"
echo "=================================================="

# Check if running on Raspberry Pi
if ! grep -q "Raspberry Pi" /proc/device-tree/model 2>/dev/null; then
    echo "⚠️  Warning: This script is designed for Raspberry Pi"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install system dependencies
echo "📦 Installing system dependencies..."
sudo apt install -y \
    hostapd \
    dnsmasq \
    alsa-utils \
    sox \
    wireless-tools \
    wpasupplicant \
    git \
    htop \
    tmux

# Create eix-piware user if not exists
if ! id "eix" &>/dev/null; then
    echo "👤 Creating eix user..."
    sudo useradd -r -s /bin/bash -d /home/eix -m eix
    sudo usermod -a -G audio,gpio,i2c,spi eix
fi

# Install application
if [ ! -d "/home/eix/eix-piware" ]; then
    echo "📥 Installing EiX-piware application..."
    sudo -u eix git clone https://github.com/your-repo/eix-piware.git /home/eix/eix-piware
else
    echo "🔄 Updating EiX-piware application..."
    cd /home/eix/eix-piware
    sudo -u eix git pull
fi

cd /home/eix/eix-piware

# Install npm dependencies
echo "📦 Installing application dependencies..."
sudo -u eix npm install --production

# Create config directory
echo "📁 Setting up configuration..."
sudo mkdir -p /etc/eix-piware
sudo chmod 755 /etc/eix-piware

# Create audio directory
sudo mkdir -p /home/eix/eix-piware/audio
sudo chown -R eix:eix /home/eix/eix-piware/audio

# Install systemd service
echo "⚙️  Installing system service..."
sudo cp eix-piware.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable eix-piware

# Configure audio
echo "🔊 Configuring audio system..."
sudo usermod -a -G audio eix

# Set audio output to 3.5mm jack (change to hdmi if needed)
sudo raspi-config nonint do_audio 1

# Configure hostapd
echo "📶 Configuring WiFi access point..."
sudo systemctl disable hostapd
sudo systemctl disable dnsmasq

# Create hostapd configuration
sudo tee /etc/hostapd/hostapd.conf > /dev/null <<EOF
interface=wlan0
driver=nl80211
ssid=EiX-Setup
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=eixsetup123
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

# Create dnsmasq configuration backup
sudo cp /etc/dnsmasq.conf /etc/dnsmasq.conf.backup

# Set permissions
sudo chown -R eix:eix /home/eix/eix-piware
sudo chmod +x /home/eix/eix-piware/src/index.js

# Enable I2C and SPI (useful for future expansions)
sudo raspi-config nonint do_i2c 0
sudo raspi-config nonint do_spi 0

echo "✅ EiX-piware installation completed!"
echo ""
echo "🚀 Starting services..."
sudo systemctl start eix-piware
sudo systemctl status eix-piware --no-pager

echo ""
echo "📋 Installation Summary:"
echo "========================"
echo "✅ System packages installed"
echo "✅ Node.js and npm installed"
echo "✅ EiX-piware application installed"
echo "✅ System service configured"
echo "✅ Audio system configured"
echo "✅ WiFi access point configured"
echo ""
echo "🌐 Setup Instructions:"
echo "1. If no WiFi is configured, device will create 'EiX-Setup' network"
echo "2. Connect to 'EiX-Setup' with password: eixsetup123"
echo "3. Open browser to 192.168.4.1 for WiFi setup"
echo "4. Select customer WiFi and enter password"
echo "5. Device will automatically connect to dashboard"
echo ""
echo "📊 Monitoring:"
echo "- Service status: sudo systemctl status eix-piware"
echo "- View logs: sudo journalctl -u eix-piware -f"
echo "- System status: http://device-ip:3000/api/status"
echo ""
echo "🎉 Installation complete! Device is ready for deployment."