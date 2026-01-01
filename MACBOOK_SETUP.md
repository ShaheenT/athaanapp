# Athaan Fi Beit - MacBook Local Setup Guide

## Prerequisites

### 1. Install Required Software
```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js 20
brew install node@20
brew link node@20

# Install PostgreSQL
brew install postgresql@16
brew services start postgresql@16

# Install Git (if not already installed)
brew install git
```

### 2. Verify Installations
```bash
# Check versions
node --version   # Should be v20.x.x
npm --version    # Should be 10.x.x
psql --version   # Should be 16.x
```

## Database Setup

### 1. Create Database
```bash
# Connect to PostgreSQL
psql postgres

# Create database and user (in psql terminal)
CREATE DATABASE athaan_fi_beit;
CREATE USER athaan_admin WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE athaan_fi_beit TO athaan_admin;
\q
```

### 2. Set Environment Variables
Create a `.env` file in the project root:
```bash
# Database Configuration
DATABASE_URL="postgresql://athaan_admin:your_secure_password@localhost:5432/athaan_fi_beit"
PGHOST=localhost
PGPORT=5432
PGUSER=athaan_admin
PGPASSWORD=your_secure_password
PGDATABASE=athaan_fi_beit

# Session Security
SESSION_SECRET="your_very_long_random_session_secret_here_min_32_chars"

# Replit Configuration (for authentication)
REPL_ID="your_repl_id"
REPLIT_DOMAINS="localhost:5000"
ISSUER_URL="https://replit.com/oidc"

# Payment Configuration (optional for testing)
PAYFAST_MERCHANT_ID="your_merchant_id"
PAYFAST_MERCHANT_KEY="your_merchant_key"
PAYFAST_PASSPHRASE="your_passphrase"

# Notification Configuration (optional)
VAPID_PUBLIC_KEY="your_vapid_public_key"
VAPID_PRIVATE_KEY="your_vapid_private_key"
```

## Project Setup

### 1. Download and Extract Project
```bash
# Navigate to your desired directory
cd ~/Desktop

# If you have the zip file, extract it
unzip athaan-fi-beit.zip
cd athaan-fi-beit

# Or if cloning from repository
git clone [your-repository-url]
cd athaan-fi-beit
```

### 2. Install Dependencies
```bash
# Install all project dependencies
npm install

# Verify installation
npm list --depth=0
```

### 3. Initialize Database Schema
```bash
# Push database schema (creates all tables)
npm run db:push

# Verify tables were created
psql athaan_fi_beit -c "\dt"
```

## Running the Application

### 1. Start Development Server
```bash
# Start the full application
npm run dev
```

You should see output like:
```
📱 Prayer notification schedule updated
📱 Notification service initialized
7:13:34 PM [express] serving on port 5000
```

### 2. Access the Application
Open your browser and navigate to:

- **Landing Page**: http://localhost:5000/
- **Admin Login**: http://localhost:5000/admin/login
- **Admin Dashboard**: http://localhost:5000/admin (after login)
- **Customer PWA**: http://localhost:5000/customer
- **Demo Dashboard**: http://localhost:5000/demo
- **Technician Portal**: http://localhost:5000/technician

## Testing Each Component

### 1. Admin Dashboard Test
1. Go to http://localhost:5000/
2. Click "Access Admin Dashboard"
3. Enter test credentials (any username/password for now)
4. Verify all sidebar navigation works:
   - Dashboard → Users → Devices → Prayer Times → Audio Profiles → Technicians → Settings
5. Test widget clickability on dashboard
6. Try uploading CSV file in Prayer Times
7. Try uploading audio file in Audio Profiles
8. Test logout functionality

### 2. Customer PWA Test
1. Go to http://localhost:5000/customer
2. Test registration/login flow
3. Verify prayer times display
4. Test volume controls
5. Check responsive design on mobile view

### 3. Raspberry Pi Software Test (Optional)
```bash
# Navigate to Pi device folder
cd pi-device

# Install Pi-specific dependencies
npm install

# Run device simulation (for testing)
npm start
```

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL if needed
brew services restart postgresql@16

# Test connection
psql -h localhost -U athaan_admin -d athaan_fi_beit -c "SELECT 1;"
```

#### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=3000 npm run dev
```

#### Node Version Issues
```bash
# Switch to Node 20
nvm use 20
# or
brew unlink node && brew link node@20
```

#### Permission Issues
```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

### Environment Variables Not Loading
```bash
# Ensure .env file is in project root
ls -la | grep .env

# Check file contents
cat .env
```

## Development Workflow

### 1. Making Changes
- Frontend changes auto-reload with Vite HMR
- Backend changes auto-restart with tsx
- Database changes require `npm run db:push`

### 2. Testing Features
```bash
# Run tests (if available)
npm test

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .
```

### 3. Database Management
```bash
# Reset database (careful - deletes all data)
npm run db:reset

# Generate migration
npm run db:generate

# Apply migration
npm run db:migrate
```

## Production Deployment Preparation

### 1. Build for Production
```bash
# Build client and server
npm run build

# Test production build
npm start
```

### 2. Environment Setup
- Set NODE_ENV=production
- Use secure DATABASE_URL
- Set strong SESSION_SECRET
- Configure proper REPLIT_DOMAINS

## System Requirements

### Minimum Specifications
- macOS 10.15 or later
- 8GB RAM
- 5GB free disk space
- Node.js 20.x
- PostgreSQL 16.x

### Recommended Specifications
- macOS 12.0 or later
- 16GB RAM
- 10GB free disk space
- Fast internet connection

## Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all environment variables are set
3. Ensure PostgreSQL is running
4. Check that all dependencies installed correctly

The system should be fully functional for local testing once these steps are completed.