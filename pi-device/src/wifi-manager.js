import wifi from 'node-wifi';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class WiFiManager {
  constructor() {
    this.initialized = false;
    this.accessPointRunning = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      wifi.init({
        iface: null // network interface, choose a random wifi interface if set to null
      });
      this.initialized = true;
      console.log('📶 WiFi Manager initialized');
    } catch (error) {
      console.error('📶 WiFi Manager initialization failed:', error);
      throw error;
    }
  }

  async isConnected() {
    await this.initialize();
    
    try {
      const connections = await wifi.getCurrentConnections();
      return connections.length > 0 && connections[0].ssid;
    } catch (error) {
      console.error('📶 Error checking WiFi connection:', error);
      return false;
    }
  }

  async getConnectionInfo() {
    await this.initialize();
    
    try {
      const connections = await wifi.getCurrentConnections();
      if (connections.length > 0) {
        return {
          ssid: connections[0].ssid,
          signal_level: connections[0].signal_level,
          frequency: connections[0].frequency,
          security: connections[0].security
        };
      }
      return null;
    } catch (error) {
      console.error('📶 Error getting connection info:', error);
      return null;
    }
  }

  async scanNetworks() {
    await this.initialize();
    
    try {
      console.log('📶 Scanning for WiFi networks...');
      const networks = await wifi.scan();
      
      // Filter and sort networks
      const filteredNetworks = networks
        .filter(network => network.ssid && network.ssid.length > 0)
        .sort((a, b) => b.signal_level - a.signal_level)
        .slice(0, 20) // Limit to top 20 networks
        .map(network => ({
          ssid: network.ssid,
          signal_level: network.signal_level,
          security: network.security,
          frequency: network.frequency
        }));

      console.log(`📶 Found ${filteredNetworks.length} networks`);
      return filteredNetworks;
    } catch (error) {
      console.error('📶 Network scan failed:', error);
      throw error;
    }
  }

  async connect(ssid, password) {
    await this.initialize();
    
    try {
      console.log(`📶 Connecting to ${ssid}...`);
      
      const connectionConfig = {
        ssid: ssid,
        password: password
      };

      await wifi.connect(connectionConfig);
      
      // Wait a bit and verify connection
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const isConnected = await this.isConnected();
      if (isConnected) {
        console.log(`📶 Successfully connected to ${ssid}`);
        
        // Stop access point if running
        if (this.accessPointRunning) {
          await this.stopAccessPoint();
        }
        
        return { success: true, ssid };
      } else {
        throw new Error('Connection verification failed');
      }
      
    } catch (error) {
      console.error(`📶 Failed to connect to ${ssid}:`, error);
      throw error;
    }
  }

  async startAccessPoint() {
    try {
      console.log('📶 Starting WiFi Access Point...');
      
      // Create hostapd configuration
      const hostapdConfig = `
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
      `;

      // Create dnsmasq configuration for DHCP
      const dnsmasqConfig = `
interface=wlan0
dhcp-range=192.168.4.2,192.168.4.20,255.255.255.0,24h
      `;

      // Stop existing services
      await execAsync('sudo systemctl stop hostapd').catch(() => {});
      await execAsync('sudo systemctl stop dnsmasq').catch(() => {});

      // Configure network interface
      await execAsync('sudo ifconfig wlan0 192.168.4.1');

      // Write configurations
      await execAsync(`echo '${hostapdConfig}' | sudo tee /etc/hostapd/hostapd.conf`);
      await execAsync(`echo '${dnsmasqConfig}' | sudo tee /etc/dnsmasq.conf`);

      // Start services
      await execAsync('sudo systemctl start dnsmasq');
      await execAsync('sudo systemctl start hostapd');

      this.accessPointRunning = true;
      console.log('📶 Access Point started: EiX-Setup (password: eixsetup123)');
      
      return true;
    } catch (error) {
      console.error('📶 Failed to start access point:', error);
      throw error;
    }
  }

  async stopAccessPoint() {
    try {
      console.log('📶 Stopping WiFi Access Point...');
      
      await execAsync('sudo systemctl stop hostapd').catch(() => {});
      await execAsync('sudo systemctl stop dnsmasq').catch(() => {});
      
      this.accessPointRunning = false;
      console.log('📶 Access Point stopped');
      
    } catch (error) {
      console.error('📶 Failed to stop access point:', error);
    }
  }

  async getNetworkStatus() {
    return {
      isConnected: await this.isConnected(),
      connectionInfo: await this.getConnectionInfo(),
      accessPointRunning: this.accessPointRunning
    };
  }
}