# Athaan Fi Beit - Production Deployment Guide

An IoT-based system that delivers automated Islamic Call to Prayer (Athaan) in homes through ceiling-mounted speakers connected to Raspberry Pi devices.

## Prerequisites

- **Node.js** 20.x or higher
- **MongoDB Atlas** account with a cluster
- **Firebase** project with Authentication enabled
- **PayFast** account (optional, for payment processing)
- **Environment Variables** configured (see setup below)

## Environment Setup

Create a `.env.local` file in the project root with the following variables:

### Backend Environment Variables
```
# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athaan-db?retryWrites=true&w=majority

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Server Configuration
NODE_ENV=production
PORT=5000

# Session Secret
SESSION_SECRET=your-random-session-secret

# PayFast (Optional)
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
```

### Frontend Environment Variables
Create `.env` file in `AthaanFBSystem/client/`:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AthaanFBSystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Add IP whitelist: `0.0.0.0/0` (for development) or your server IP (for production)
   - Create a database user with appropriate permissions
   - Copy the connection string and add to `.env.local`

4. **Set up Firebase**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and OIDC)
   - Generate service account key (Project Settings → Service Accounts)
   - Add Firebase config to frontend `.env` file

## Building for Production

```bash
# Start the production server (includes hot reload)
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
AthaanFBSystem/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components (Landing, Login, Dashboard, etc.)
│   │   ├── components/    # Reusable components (Sidebar, Modals, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
│   ├── public/            # Static assets
│   └── vite.config.ts     # Vite configuration
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # MongoDB schemas
│   │   ├── middleware/    # Express middleware
│   │   └── services/      # Business logic
│   └── index.ts           # Server entry point
├── .env.local             # Environment variables
└── package.json           # Dependencies and scripts
```

## Key Features

### Admin Dashboard
- User management (create, read, update, delete)
- Device management (online/offline monitoring via WebSocket)
- Prayer time scheduling and configuration
- Real-time status updates
- Emerald green Islamic theme

### Customer Portal (PWA)
- User registration and authentication
- Subscription management
- Device control and status monitoring
- Payment history tracking

### IoT Device Integration
- Raspberry Pi support with Node.js
- Automated prayer time scheduling via node-cron
- WiFi management and access point setup
- Real-time status reporting via WebSocket
- Audio playback with ALSA/PulseAudio integration

### Payment Processing
- PayFast integration for South African market
- Recurring subscription billing
- Webhook-based payment confirmation
- Sandbox mode for testing

## API Endpoints

### Authentication
- `POST /api/auth/login` - Firebase login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create new device
- `PUT /api/devices/:id` - Update device
- `DELETE /api/devices/:id` - Delete device
- `WS /ws` - WebSocket connection for real-time device status

### Prayer Times
- `GET /api/prayer-times` - List prayer times
- `POST /api/prayer-times` - Create prayer time entry
- `PUT /api/prayer-times/:id` - Update prayer time
- `DELETE /api/prayer-times/:id` - Delete prayer time

### WebSocket Events
- `device:connect` - Device connection
- `device:disconnect` - Device disconnection
- `device:status` - Device status update
- `prayer:broadcast` - Broadcast prayer times to devices
- `command:execute` - Send command to device

## Database Schema

### Collections
- **users** - Authentication and user profiles
- **devices** - IoT device information and settings
- **prayertimes** - Daily prayer schedules
- **customerprofiles** - Extended customer information
- **audioprofiles** - Athaan audio file metadata
- **activitylogs** - System event logging
- **sessions** - Express session storage

## Theme Configuration

### Islamic Theme Colors
- **Primary (Emerald Green)**: `hsl(123, 38%, 35%)` - Main brand color for buttons and highlights
- **Secondary (Blue)**: `hsl(207, 90%, 54%)` - Feature cards and secondary elements
- **Accent (Orange/Gold)**: `hsl(33, 100%, 48%)` - Call-to-action and important elements

All theme colors are configured in `client/src/index.css` and use Tailwind CSS custom color variables.

## Security Considerations

1. **Never commit `.env` files to version control**
2. **Use strong passwords and session secrets**
3. **Enable HTTPS in production**
4. **Validate and sanitize all user inputs**
5. **Use Firebase Authentication for user verification**
6. **Implement CORS properly for API security**
7. **Regular security audits of dependencies**
8. **Monitor WebSocket connections for unauthorized access**

## Deployment Checklist

- [ ] MongoDB Atlas cluster created and configured with IP whitelist
- [ ] Firebase project set up with authentication enabled
- [ ] Environment variables configured in deployment platform
- [ ] SSL certificate installed (HTTPS required)
- [ ] CORS origins configured correctly
- [ ] Payment gateway tested in sandbox mode
- [ ] Database backups configured
- [ ] Error logging and monitoring set up
- [ ] Rate limiting configured for API endpoints
- [ ] WebSocket server tested for real-time communication
- [ ] Firebase credentials validated
- [ ] All secrets stored securely (not in code)

## Troubleshooting

### MongoDB Connection Issues
- Verify IP whitelist in MongoDB Atlas Network Access
- Check connection string in `.env.local`
- Ensure database user has correct permissions
- Test connection with `mongosh` before deploying

### Firebase Authentication Errors
- Verify Firebase credentials in `.env` and `.env.local`
- Check if OAuth redirect URLs are configured in Firebase Console
- Enable required authentication methods in Firebase
- Clear browser cache and try again

### Device Connection Problems
- Check WebSocket server is running on port 5000
- Verify network connectivity on Raspberry Pi
- Check device has valid serial number registered
- Review device logs in Activity section

### Styling Issues
- Ensure Tailwind CSS is built with `npm run dev`
- Check that `index.css` is imported in `main.tsx`
- Verify Tailwind config includes all template paths
- Clear browser cache for CSS updates

## Support

For issues or questions, refer to:
- System architecture documentation in `replit.md`
- API endpoint documentation above
- Database schema details above
- Deployment checklist above

## License

Proprietary - Athaan Fi Beit System

## Production Deployment Steps

1. Configure environment variables on your hosting platform
2. Ensure MongoDB Atlas is accessible from your server IP
3. Set `NODE_ENV=production` in environment
4. Run `npm install` to install dependencies
5. Start with `npm run dev` (or use appropriate production command)
6. Monitor application logs for errors
7. Test all critical paths (login, user management, devices, prayer times)
8. Set up monitoring and alerting for production

---

**Last Updated**: November 21, 2025
**Version**: 1.0.0-production
