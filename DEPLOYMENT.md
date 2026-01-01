# Deployment Guide - Athaan Fi Beit System

## Quick Start for MacBook Development

### Prerequisites Check
```bash
# Verify Node.js (18+)
node --version

# Verify PostgreSQL
psql --version

# Install if missing
brew install node postgresql@14
```

### 1-Minute Setup
```bash
# Clone and install
git clone <repository-url>
cd athaan-fi-beit
npm install

# Setup database
brew services start postgresql@14
createdb athaan_fi_beit
npm run db:push

# Create .env file
echo "DATABASE_URL=postgresql://localhost:5432/athaan_fi_beit
SESSION_SECRET=$(node -e 'console.log(require("crypto").randomBytes(64).toString("hex"))')
NODE_ENV=development
PORT=5000" > .env

# Start application
npm run dev
```

### Access Points
- Admin Dashboard: http://localhost:5000/admin
- Customer PWA: http://localhost:5000/customer  
- Demo (no auth): http://localhost:5000/demo

### Test Device Simulation
```bash
# In separate terminal
cd pi-device
node src/index.js
```

## Production Deployment

### Environment Variables
```bash
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
SESSION_SECRET=your-secret-key
PAYFAST_MERCHANT_ID=your-id
PAYFAST_MERCHANT_KEY=your-key
PAYFAST_SANDBOX=false
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
```

### Build and Deploy
```bash
npm run build
npm start
```

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Admin Web     │    │   Customer PWA  │    │  Raspberry Pi   │
│   Dashboard     │    │   Application   │    │   EiX-Piware    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Backend API   │
                    │   WebSocket     │
                    │   PostgreSQL    │
                    └─────────────────┘
```

## Troubleshooting

### Database Issues
```bash
# Reset schema
npm run db:push

# Check connection
psql $DATABASE_URL -c "SELECT version();"
```

### Port Conflicts
```bash
# Find process on port 5000
lsof -i :5000
kill -9 <PID>
```

### WebSocket Connection
```bash
# Test WebSocket
wscat -c ws://localhost:5000/ws
```

Ready to deploy! 🚀