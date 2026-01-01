# Athaan Fi Beit - Complete Deployment Guide

## Overview

This guide covers the complete deployment process for the Athaan Fi Beit Islamic Prayer Management System across all environments: development, staging/QA, UAT, and production.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Environment Configuration](#environment-configuration)
3. [Development Setup](#development-setup)
4. [Staging/QA Deployment](#staging-qa-deployment)
5. [UAT Deployment](#uat-deployment)
6. [Production Deployment](#production-deployment)
7. [Real-time Data Integration](#real-time-data-integration)
8. [CI/CD Pipeline](#ci-cd-pipeline)
9. [Platform-Specific Deployment](#platform-specific-deployment)
10. [MacBook Setup Instructions](#macbook-setup-instructions)

## System Requirements

### Minimum Requirements
- **Node.js**: v20.x LTS
- **MongoDB**: v6.0+
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 10GB free space
- **Network**: Stable internet connection for API integrations

### Dependencies
- Express.js (Backend API)
- React 18 (Frontend)
- MongoDB/Mongoose (Database)
- Vite (Build tool)
- Tailwind CSS (Styling)

## Environment Configuration

### Environment Variables

#### Development (.env.development)
```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/athaan_fi_beit_dev
SESSION_SECRET=dev-secret-key-change-in-production
REPLIT_OIDC_CLIENT_ID=your-replit-client-id
REPLIT_OIDC_CLIENT_SECRET=your-replit-client-secret

# PayFast Configuration (Sandbox)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=jt7NOE43FZPn
PAYFAST_SANDBOX=true

# Prayer Times API
ALADHAN_API_BASE_URL=https://api.aladhan.com/v1

# VAPID Keys for Push Notifications
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:admin@athaanfibeit.com

# Email Configuration (Development)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
FROM_EMAIL=noreply@athaanfibeit.com
```

#### Staging (.env.staging)
```bash
NODE_ENV=staging
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athaan_fi_beit_staging
SESSION_SECRET=staging-secret-key-secure-random-string
REPLIT_OIDC_CLIENT_ID=staging-replit-client-id
REPLIT_OIDC_CLIENT_SECRET=staging-replit-client-secret

# PayFast Configuration (Sandbox)
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=staging-passphrase
PAYFAST_SANDBOX=true

# Prayer Times API
ALADHAN_API_BASE_URL=https://api.aladhan.com/v1

# VAPID Keys
VAPID_PUBLIC_KEY=staging-vapid-public-key
VAPID_PRIVATE_KEY=staging-vapid-private-key
VAPID_SUBJECT=mailto:staging@athaanfibeit.com

# Email Configuration (Staging)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=staging@athaanfibeit.com
```

#### Production (.env.production)
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athaan_fi_beit_prod
SESSION_SECRET=production-ultra-secure-random-string-64-chars-minimum
REPLIT_OIDC_CLIENT_ID=production-replit-client-id
REPLIT_OIDC_CLIENT_SECRET=production-replit-client-secret

# PayFast Configuration (Production)
PAYFAST_MERCHANT_ID=your-live-merchant-id
PAYFAST_MERCHANT_KEY=your-live-merchant-key
PAYFAST_PASSPHRASE=your-live-passphrase
PAYFAST_SANDBOX=false

# Prayer Times API
ALADHAN_API_BASE_URL=https://api.aladhan.com/v1

# VAPID Keys
VAPID_PUBLIC_KEY=production-vapid-public-key
VAPID_PRIVATE_KEY=production-vapid-private-key
VAPID_SUBJECT=mailto:admin@athaanfibeit.com

# Email Configuration (Production)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-production-sendgrid-api-key
FROM_EMAIL=noreply@athaanfibeit.com

# Security Headers
ALLOWED_ORIGINS=https://athaanfibeit.com,https://www.athaanfibeit.com
CORS_ENABLED=true
```

## Development Setup

### Local Development Environment

1. **Clone Repository**
```bash
git clone https://github.com/your-org/athaan-fi-beit.git
cd athaan-fi-beit
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup MongoDB**
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0

# Or install MongoDB Community Edition
# Follow MongoDB installation guide for your OS
```

4. **Configure Environment**
```bash
cp .env.example .env.development
# Edit .env.development with your local configuration
```

5. **Initialize Database**
```bash
npm run db:setup
npm run db:seed
```

6. **Start Development Server**
```bash
npm run dev
```

### Development Workflow

1. **Branch Strategy**
   - `main`: Production-ready code
   - `staging`: Staging environment code
   - `develop`: Development integration branch
   - `feature/*`: Feature development branches

2. **Testing**
```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e
```

3. **Code Quality**
```bash
# Linting
npm run lint

# Type checking
npm run type-check

# Format code
npm run format
```

## Staging/QA Deployment

### Prerequisites
- Access to staging MongoDB cluster
- PayFast sandbox account
- Staging domain setup

### Deployment Steps

1. **Environment Setup**
```bash
# Deploy to staging environment
npm run deploy:staging

# Or manual deployment
npm run build:staging
npm run db:migrate:staging
```

2. **Database Migration**
```bash
# Run staging migrations
NODE_ENV=staging npm run db:migrate

# Seed staging data
NODE_ENV=staging npm run db:seed:staging
```

3. **Testing Checklist**
   - [ ] User registration flow
   - [ ] Payment integration (sandbox)
   - [ ] Admin dashboard functionality
   - [ ] Customer PWA features
   - [ ] Pi device simulation
   - [ ] Prayer time calculations
   - [ ] Email notifications
   - [ ] Push notifications

## UAT Deployment

### User Acceptance Testing Environment

1. **Setup UAT Environment**
```bash
# Deploy UAT version
npm run deploy:uat

# Configure UAT-specific settings
NODE_ENV=uat npm run configure
```

2. **UAT Testing Scenarios**
   - Customer registration and payment
   - Device management workflows
   - Prayer time accuracy testing
   - System integration testing
   - Performance testing

3. **Client Access Setup**
```bash
# Create UAT test accounts
npm run create:test-accounts

# Generate test data
npm run generate:test-data
```

## Production Deployment

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Database backup created
- [ ] SSL certificates configured
- [ ] DNS records configured
- [ ] CDN setup (if applicable)
- [ ] Monitoring configured

### Production Deployment Steps

1. **Build Production Assets**
```bash
npm run build:production
```

2. **Database Migration**
```bash
# Backup production database
npm run db:backup

# Run production migrations
NODE_ENV=production npm run db:migrate
```

3. **Deploy Application**
```bash
npm run deploy:production
```

4. **Post-deployment Verification**
```bash
# Health check
npm run health-check

# Smoke tests
npm run test:smoke
```

## Real-time Data Integration

### Prayer Times Integration

1. **Aladhan API Setup**
```javascript
// server/prayer-calculator.ts
const ALADHAN_API_CONFIG = {
  baseUrl: process.env.ALADHAN_API_BASE_URL,
  method: 2, // ISNA calculation method
  locations: ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth']
};
```

2. **Automated Updates**
```bash
# Schedule daily prayer time updates
0 2 * * * NODE_ENV=production npm run update:prayer-times
```

### Payment Integration

1. **PayFast Configuration**
```javascript
// server/payments.ts
const PAYFAST_CONFIG = {
  merchantId: process.env.PAYFAST_MERCHANT_ID,
  merchantKey: process.env.PAYFAST_MERCHANT_KEY,
  passphrase: process.env.PAYFAST_PASSPHRASE,
  sandbox: process.env.PAYFAST_SANDBOX === 'true'
};
```

2. **Webhook Handling**
```javascript
// Handle payment confirmations
app.post('/api/public/payment/webhook', paymentWebhookHandler);
```

### IoT Device Integration

1. **WebSocket Setup**
```javascript
// Real-time device communication
const wss = new WebSocketServer({ port: 8080 });
```

2. **Device Registration**
```javascript
// Automatic device discovery and registration
app.post('/api/devices/register', deviceRegistrationHandler);
```

## CI/CD Pipeline

### GitHub Actions Configuration

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Athaan Fi Beit

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run test
      - run: npm run test:integration

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:staging
      - name: Deploy to Staging
        env:
          STAGING_TOKEN: ${{ secrets.STAGING_TOKEN }}
        run: npm run deploy:staging

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build:production
      - name: Deploy to Production
        env:
          PRODUCTION_TOKEN: ${{ secrets.PRODUCTION_TOKEN }}
        run: npm run deploy:production
```

## Platform-Specific Deployment

### Replit Deployment

1. **Replit Configuration**
```toml
# .replit
modules = ["nodejs-20", "web"]
run = "npm run dev"

[deployment]
deploymentTarget = "autoscale"
build = ["npm", "run", "build"]
run = ["npm", "run", "start"]

[[ports]]
localPort = 5000
externalPort = 80
```

2. **Environment Secrets**
```bash
# Add secrets in Replit Secrets tab
MONGODB_URI
SESSION_SECRET
PAYFAST_MERCHANT_ID
PAYFAST_MERCHANT_KEY
```

### Vercel Deployment

1. **Vercel Configuration**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "dist/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

### Firebase Deployment

1. **Firebase Configuration**
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "functions": {
    "source": "functions"
  }
}
```

## MacBook Setup Instructions

### Intel MacBook Setup

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@20
brew link node@20

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Install Git
brew install git

# Clone and setup project
git clone https://github.com/your-org/athaan-fi-beit.git
cd athaan-fi-beit
npm install

# Install global tools
npm install -g pm2 @vercel/cli

# Setup development environment
cp .env.example .env.development
npm run db:setup
npm run dev
```

### M2/M3 MacBook Setup

```bash
# Install Rosetta 2 (if needed for compatibility)
softwareupdate --install-rosetta

# Install Homebrew (Apple Silicon)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add Homebrew to PATH
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"

# Install Node.js (Apple Silicon native)
brew install node@20
brew link node@20

# Install MongoDB (Apple Silicon native)
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0

# Verify installations
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
mongod --version # Should show db version v6.0.x

# Install global tools
npm install -g pm2 @vercel/cli

# Clone and setup project
git clone https://github.com/your-org/athaan-fi-beit.git
cd athaan-fi-beit

# Install dependencies (native ARM64)
npm install

# Setup development environment
cp .env.example .env.development
npm run db:setup
npm run db:seed
npm run dev
```

### Development Tools Setup

```bash
# Install VS Code (Apple Silicon)
brew install --cask visual-studio-code

# Install useful VS Code extensions
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension mongodb.mongodb-vscode

# Install Docker Desktop (Apple Silicon)
brew install --cask docker

# Install Postman for API testing
brew install --cask postman

# Install MongoDB Compass for database management
brew install --cask mongodb-compass
```

## Testing and QA Procedures

### Client Testing Access

1. **Create Test Environment**
```bash
# Setup demo environment with test data
npm run setup:demo
npm run seed:demo-data
```

2. **Test User Accounts**
```javascript
// Create test accounts for different user types
const testUsers = {
  admin: { email: 'admin@test.com', password: 'test123' },
  customer: { email: 'customer@test.com', password: 'test123' },
  technician: { email: 'tech@test.com', password: 'test123' }
};
```

3. **Testing Checklist**
   - [ ] User registration and payment flow
   - [ ] Admin dashboard all features
   - [ ] Customer PWA functionality
   - [ ] Device management
   - [ ] Prayer time accuracy
   - [ ] Email and push notifications
   - [ ] Payment processing
   - [ ] Error handling
   - [ ] Mobile responsiveness
   - [ ] Performance testing

## Monitoring and Maintenance

### Health Monitoring
```bash
# Setup monitoring endpoints
npm run setup:monitoring

# Configure alerts
npm run configure:alerts
```

### Backup Procedures
```bash
# Automated daily backups
0 1 * * * npm run backup:database

# Weekly full system backup
0 2 * * 0 npm run backup:full
```

### Update Procedures
```bash
# Update prayer times daily
npm run update:prayer-times

# Update dependencies monthly
npm run update:dependencies

# Security updates as needed
npm audit && npm audit fix
```

## Support and Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Check MongoDB service status
   - Verify connection string
   - Check firewall settings

2. **Payment Integration Issues**
   - Verify PayFast credentials
   - Check sandbox/production mode
   - Review webhook configuration

3. **Authentication Issues**
   - Verify Replit OIDC configuration
   - Check session configuration
   - Review CORS settings

### Support Contacts
- **Technical Support**: tech@athaanfibeit.com
- **Emergency Contact**: +27 82 123 4567
- **Documentation**: https://docs.athaanfibeit.com

## Conclusion

This deployment guide provides comprehensive instructions for deploying the Athaan Fi Beit system across all environments. Follow the specific sections relevant to your deployment scenario and ensure all prerequisites are met before proceeding.

For additional support or clarification, refer to the project documentation or contact the development team.