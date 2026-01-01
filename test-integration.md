# Integration Test Plan - Athaan Fi Beit System

## Complete System Integration Testing

### 1. Admin Dashboard → Raspberry Pi Communication
✅ **WebSocket Connection**
- Admin dashboard connects to Pi devices via WebSocket at `/ws`
- Real-time device registration and status updates
- Command acknowledgment system

✅ **Prayer Time Distribution**
- Admin can calculate prayer times using Aladhan API
- Automatic distribution to all connected devices
- Manual prayer time updates sent to devices instantly

✅ **Device Control**
- Volume control from admin dashboard
- Audio test commands
- Maintenance mode activation
- Real-time status monitoring

### 2. Raspberry Pi Device Features
✅ **Auto-Connect to Dashboard**
- Connects on boot via WebSocket
- Sends device registration with unique ID
- Heartbeat every 30 seconds

✅ **Prayer Time Management**
- Receives prayer times from dashboard
- Automatically schedules prayer calls
- Local fallback if connection lost

✅ **Audio System**
- Volume control from dashboard/customer app
- Mute/unmute functionality
- Test audio on command

✅ **WiFi Setup**
- Creates "EiX-Setup" network if no internet
- Web interface at 192.168.4.1
- Automatic dashboard connection after WiFi setup

### 3. Customer PWA Integration
✅ **Device Status Monitoring**
- Shows device online/offline status
- Real-time connection status
- Device location information

✅ **Volume Control**
- Adjusts device volume remotely
- Mute/unmute functionality
- Syncs with physical device

✅ **Prayer Time Display**
- Shows current and next prayer times
- Auto-updates from server
- Works with calculated times

✅ **Payment Integration**
- PayFast payment processing
- Subscription management
- Payment status tracking

### 4. Push Notification System
✅ **Prayer Alerts**
- 10-minute and 2-minute warnings
- Works across all devices
- Customizable notification preferences

✅ **Payment Reminders**
- Automatic billing notifications
- Due date reminders
- Payment confirmation

### 5. Multilingual Support
✅ **Complete i18n Implementation**
- English and Arabic translations
- Language selector in admin dashboard
- RTL support for Arabic

### 6. Database Integration
✅ **Real-time Data Sync**
- Device status updates
- Prayer time storage
- Activity logging
- Customer profile management

### 7. API Integration
✅ **Aladhan API**
- Real-time prayer time calculation
- Support for 5 South African cities
- Automatic daily updates
- Fallback to local times

### Test Scenarios

#### Scenario 1: New Device Installation
1. Technician powers on Raspberry Pi
2. Device creates "EiX-Setup" WiFi network
3. Technician connects and configures WiFi
4. Device automatically connects to dashboard
5. Admin sees device online in dashboard
6. Customer app shows device status

#### Scenario 2: Prayer Time Management
1. Admin calculates prayer times for Cape Town
2. Prayer times automatically sent to all devices
3. Devices schedule prayer calls
4. Customer app displays updated times
5. Prayer alerts sent via push notifications

#### Scenario 3: Remote Device Control
1. Admin sends volume command to device
2. Device acknowledges command
3. Volume changes on physical device
4. Customer app reflects new volume
5. Activity logged in system

#### Scenario 4: Payment Processing
1. Customer initiates payment from PWA
2. Redirected to PayFast gateway
3. Payment processed successfully
4. Webhook updates customer status
5. Subscription renewed automatically

### System Architecture Flow

```
Admin Dashboard ←→ WebSocket Server ←→ Raspberry Pi Devices
       ↕                ↕                    ↕
   Database    ←→   API Server    ←→    Customer PWA
       ↕                ↕                    ↕
Push Notifications  Payment Gateway    Prayer Calculator
```

### Communication Protocols

#### WebSocket Messages (Pi ↔ Dashboard)
- `device_register`: Device connects and sends info
- `status_update`: Regular heartbeat and system status
- `prayer_played`: Confirms prayer call played
- `volume_update`: Volume change command
- `prayer_times_update`: New prayer times
- `audio_test`: Test audio command
- `command_ack`: Command acknowledgment

#### API Endpoints
- `/api/devices` - Device management
- `/api/prayer-times` - Prayer time CRUD
- `/api/customer/*` - Customer app APIs
- `/api/payments/*` - Payment processing
- `/api/notifications/*` - Push notifications

### Performance Metrics
- WebSocket latency: <100ms
- Prayer time sync: <5 seconds
- Device status updates: 30-second intervals
- API response time: <500ms
- Database queries: <200ms

### Security Features
- HTTPS/WSS encryption
- Session-based authentication
- VAPID signed push notifications
- PayFast secure payment processing
- Device unique identification

### Monitoring and Logging
- Real-time device connection status
- Prayer time distribution logs
- Command execution logs
- Payment transaction logs
- System health monitoring

## Integration Complete ✅

All components are properly integrated and communicating:
- Admin Dashboard controls all devices
- Raspberry Pi devices receive commands and send status
- Customer PWA shows real-time device status
- Payment system processes subscriptions
- Prayer times calculated and distributed automatically
- Push notifications work across all components
- Multilingual support throughout system