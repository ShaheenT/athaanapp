// Demo data for testing without MongoDB dependency

export const demoCustomers = [
  {
    _id: "1",
    userId: "demo-user-1",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed.hassan@example.com",
    phone: "+27123456789",
    address: "123 Main St, Cape Town, South Africa",
    membershipId: "ATH-2024-001",
    accountEnabled: true,
    paymentStatus: "active",
    subscriptionType: "monthly",
    nextPaymentDate: "2025-02-15",
    locationPreference: "Cape Town",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2025-01-15")
  },
  {
    _id: "2",
    userId: "demo-user-2",
    firstName: "Fatima",
    lastName: "Al-Rashid",
    email: "fatima.rashid@example.com",
    phone: "+27987654321",
    address: "456 Ocean View Dr, Durban, South Africa",
    membershipId: "ATH-2024-002",
    accountEnabled: true,
    paymentStatus: "overdue",
    subscriptionType: "annual",
    nextPaymentDate: "2025-01-20",
    locationPreference: "Durban",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2025-01-10")
  },
  {
    _id: "3",
    userId: "demo-user-3",
    firstName: "Omar",
    lastName: "Patel",
    email: "omar.patel@example.com",
    phone: "+27555123456",
    address: "789 Garden Route, Johannesburg, South Africa",
    membershipId: "ATH-2024-003",
    accountEnabled: false,
    paymentStatus: "suspended",
    subscriptionType: "monthly",
    nextPaymentDate: "2025-02-01",
    locationPreference: "Johannesburg",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2025-01-05")
  }
];

export const demoDevices = [
  {
    _id: "device-1",
    deviceId: "ATH-PI-001",
    serialNumber: "ATH2024001",
    customerId: "1",
    customerName: "Ahmed Hassan",
    location: "Cape Town, South Africa",
    status: "online",
    isOnline: true,
    lastSeen: new Date(),
    firmwareVersion: "1.2.3",
    audioVolume: 75,
    isMuted: false,
    maintenanceMode: false,
    wifiSSID: "Hassan_Home_WiFi",
    ipAddress: "192.168.1.100",
    macAddress: "B8:27:EB:12:34:56",
    temperature: 42.5,
    uptime: "15 days, 3 hours",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date()
  },
  {
    _id: "device-2",
    deviceId: "ATH-PI-002",
    serialNumber: "ATH2024002",
    customerId: "2",
    customerName: "Fatima Al-Rashid",
    location: "Durban, South Africa",
    status: "offline",
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    firmwareVersion: "1.2.2",
    audioVolume: 80,
    isMuted: false,
    maintenanceMode: false,
    wifiSSID: "Rashid_Network",
    ipAddress: "192.168.0.45",
    macAddress: "B8:27:EB:56:78:90",
    temperature: 38.2,
    uptime: "8 days, 12 hours",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date(Date.now() - 3600000)
  },
  {
    _id: "device-3",
    deviceId: "ATH-PI-003",
    serialNumber: "ATH2024003",
    customerId: "3",
    customerName: "Omar Patel",
    location: "Johannesburg, South Africa",
    status: "maintenance",
    isOnline: true,
    lastSeen: new Date(),
    firmwareVersion: "1.1.9",
    audioVolume: 60,
    isMuted: true,
    maintenanceMode: true,
    wifiSSID: "Patel_IoT",
    ipAddress: "10.0.0.15",
    macAddress: "B8:27:EB:AB:CD:EF",
    temperature: 45.1,
    uptime: "2 days, 6 hours",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date()
  }
];

export const demoPrayerTimes = [
  {
    _id: "prayer-1",
    location: "Cape Town",
    locationHash: "cape-town-sa",
    date: "2025-01-27",
    fajr: "04:35",
    sunrise: "06:05",
    dhuhr: "13:15",
    asr: "16:45",
    maghrib: "20:25",
    isha: "21:55",
    source: "aladhan",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "prayer-2",
    location: "Durban",
    locationHash: "durban-sa",
    date: "2025-01-27",
    fajr: "04:25",
    sunrise: "05:50",
    dhuhr: "12:55",
    asr: "16:30",
    maghrib: "19:58",
    isha: "21:20",
    source: "aladhan",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "prayer-3",
    location: "Johannesburg",
    locationHash: "johannesburg-sa",
    date: "2025-01-27",
    fajr: "04:15",
    sunrise: "05:45",
    dhuhr: "12:50",
    asr: "16:25",
    maghrib: "19:55",
    isha: "21:25",
    source: "aladhan",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const demoAudioProfiles = [
  {
    _id: "audio-1",
    name: "Traditional Makkah",
    description: "Classic Athaan from Masjid al-Haram",
    fileName: "makkah-traditional.mp3",
    duration: 240,
    isDefault: true,
    uploadedBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    _id: "audio-2",
    name: "Beautiful Recitation",
    description: "Melodic Athaan with beautiful voice",
    fileName: "beautiful-recitation.mp3",
    duration: 300,
    isDefault: false,
    uploadedBy: "admin",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15")
  },
  {
    _id: "audio-3",
    name: "Short Version",
    description: "Concise Athaan for quick calls",
    fileName: "short-athaan.mp3",
    duration: 180,
    isDefault: false,
    uploadedBy: "admin",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01")
  }
];

export const demoTechnicians = [
  {
    _id: "tech-1",
    name: "Mohammed Ali",
    email: "mohammed.ali@athaanfibeit.com",
    phone: "+27123456789",
    location: "Cape Town",
    expertise: "Hardware Installation",
    isActive: true,
    assignedDevices: 15,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2025-01-15")
  },
  {
    _id: "tech-2",
    name: "Aisha Patel",
    email: "aisha.patel@athaanfibeit.com",
    phone: "+27987654321",
    location: "Johannesburg",
    expertise: "Network Configuration",
    isActive: true,
    assignedDevices: 12,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2025-01-10")
  },
  {
    _id: "tech-3",
    name: "Yusuf Hassan",
    email: "yusuf.hassan@athaanfibeit.com",
    phone: "+27555987654",
    location: "Durban",
    expertise: "Audio Systems",
    isActive: false,
    assignedDevices: 8,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-12-15")
  }
];

export const demoActivityLogs = [
  {
    _id: "log-1",
    timestamp: new Date(),
    userId: "admin",
    action: "Device Status Update",
    description: "Device ATH-PI-001 came online",
    category: "device",
    deviceId: "ATH-PI-001"
  },
  {
    _id: "log-2",
    timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    userId: "admin",
    action: "Prayer Time Update",
    description: "Prayer times updated for Cape Town",
    category: "prayer",
    location: "Cape Town"
  },
  {
    _id: "log-3",
    timestamp: new Date(Date.now() - 600000), // 10 minutes ago
    userId: "admin",
    action: "User Registration",
    description: "New customer Ahmed Hassan registered",
    category: "user",
    customerId: "1"
  },
  {
    _id: "log-4",
    timestamp: new Date(Date.now() - 900000), // 15 minutes ago
    userId: "tech-1",
    action: "Device Maintenance",
    description: "Scheduled maintenance completed for ATH-PI-003",
    category: "maintenance",
    deviceId: "ATH-PI-003"
  },
  {
    _id: "log-5",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    userId: "admin",
    action: "Audio Profile Upload",
    description: "New audio profile 'Beautiful Recitation' uploaded",
    category: "audio",
    audioProfileId: "audio-2"
  }
];

export const demoDashboardStats = {
  totalUsers: demoCustomers.length,
  activeDevices: demoDevices.filter(d => d.isOnline).length,
  totalDevices: demoDevices.length,
  nextPrayer: {
    name: "Maghrib",
    time: "20:25"
  }
};