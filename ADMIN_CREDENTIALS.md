# Athaan Fi Beit - Admin Credentials & Testing Guide

## 🔐 Admin Login Credentials

**Admin Dashboard Access:**
- **URL**: `http://localhost:5000/admin/login`
- **Username**: `admin`
- **Password**: `admin123`

## 🚀 Quick Start Testing Guide

### 1. Launch the Application
```bash
# Ensure MongoDB is running
./start-services.sh

# Start the application
npm run dev
```

### 2. Test Landing Page
- Visit: `http://localhost:5000/`
- Features to test:
  - ✅ "Get Started - Sign Up Now" button → `/signup`
  - ✅ "View Athaan Fi Beit Dashboard" button → `/demo`
  - ✅ "Admin Login" button → `/admin/login`
  - ✅ "Customer Portal (PWA)" button → `/customer`

### 3. Test Demo Dashboard (No Login Required)
- Visit: `http://localhost:5000/demo`
- Features to test:
  - ✅ All sidebar navigation works
  - ✅ Users page shows dummy customer data
  - ✅ Devices page shows sample IoT devices
  - ✅ Prayer Times page shows daily prayer schedule
  - ✅ Audio Profiles page shows Athaan audio files
  - ✅ All widgets are clickable and redirect correctly

### 4. Test Admin Login
- Visit: `http://localhost:5000/admin/login`
- Use credentials: `admin` / `admin123`
- Should redirect to: `http://localhost:5000/admin`

### 5. Test Customer Registration
- Visit: `http://localhost:5000/signup`
- Features to test:
  - ✅ User registration form
  - ✅ Payment integration with PayFast
  - ✅ Membership ID generation
  - ✅ Email confirmation system

### 6. Test Customer PWA App
- Visit: `http://localhost:5000/customer`
- Features to test:
  - ✅ Customer login with email/membership ID
  - ✅ Prayer times display
  - ✅ Audio controls (volume, mute)
  - ✅ Device status monitoring
  - ✅ Push notification preferences

## 🔧 System Components

### Frontend Routes
- `/` - Marketing landing page
- `/signup` - Customer registration
- `/demo` - Demo dashboard (no auth required)
- `/admin/login` - Admin login
- `/admin/*` - Admin dashboard (auth required)
- `/customer` - Customer PWA app

### API Endpoints
- `POST /api/admin/login` - Admin authentication
- `GET /api/demo/*` - Demo data endpoints
- `POST /api/customer/register` - Customer registration
- `POST /api/payments/create` - Payment processing
- `GET /api/prayer-times` - Prayer times data
- `WebSocket /ws` - Real-time device communication

## 🧪 Testing Scenarios

### Scenario 1: New Customer Journey
1. Land on homepage (`/`)
2. Click "Get Started - Sign Up Now"
3. Complete registration form
4. Process payment via PayFast
5. Receive membership ID
6. Access customer portal

### Scenario 2: Admin Management
1. Login as admin (`admin`/`admin123`)
2. View dashboard statistics
3. Manage customer accounts
4. Monitor device status
5. Update prayer times
6. Configure audio profiles

### Scenario 3: Demo Experience
1. Visit demo dashboard (`/demo`)
2. Navigate through all admin pages
3. View dummy data in all sections
4. Test all widget interactions
5. Verify responsive design

## 🔍 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB status
ps aux | grep mongo

# Restart MongoDB
./start-services.sh

# Check logs
tail -f /tmp/mongodb/mongod.log
```

### Application Crashes
```bash
# Check for MongoDB connectivity
mongo --eval "db.stats()"

# Restart application
npm run dev
```

### PWA Not Loading
- Check service worker registration
- Verify manifest.json is accessible
- Check browser console for errors

## 📱 PWA Installation

### Desktop Installation
1. Visit `http://localhost:5000/customer`
2. Look for "Install App" button in browser
3. Follow browser prompts to install

### Mobile Installation
1. Open in mobile browser
2. Add to Home Screen option
3. Launch as standalone app

## 🔐 Security Notes

- Admin credentials are hardcoded for demo purposes
- In production, use proper authentication system
- PayFast integration includes sandbox mode
- SSL/TLS required for production deployment

## 📊 Demo Data Overview

### Sample Customers
- 25 registered customers
- Mix of active/inactive accounts
- Various subscription types
- Different payment statuses

### Sample Devices
- 15 IoT devices
- Online/offline status simulation
- Different locations across South Africa
- Various device types and models

### Prayer Times
- Accurate times for 5 South African cities
- Real-time updates via Aladhan API
- Hijri calendar integration
- Sunrise/sunset calculations

### Audio Profiles
- 6 different Athaan styles
- Various reciters and languages
- Different durations and qualities
- Default profile settings

## 🎯 Production Deployment

See `DEPLOYMENT_GUIDE.md` for complete production deployment instructions including:
- Environment configuration
- Database setup
- SSL certificate installation
- Domain configuration
- CI/CD pipeline setup

## 📞 Support

For technical support or questions:
- Email: admin@athaanfibeit.com
- Documentation: See project README.md
- Issues: Check troubleshooting section above