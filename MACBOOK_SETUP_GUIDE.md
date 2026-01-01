# MacBook Setup Guide for Athaan Fi Beit

## Prerequisites for Intel MacBook

### 1. Install Development Tools

```bash
# Install Xcode Command Line Tools
xcode-select --install

# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (version 20+)
brew install node@20
echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Verify installations
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### 2. Install MongoDB (For Local Development)

```bash
# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify MongoDB is running
brew services list | grep mongodb
```

### 3. Clone and Setup Project

```bash
# Clone the project (if using Git)
git clone <your-repo-url>
cd athaan-fi-beit

# Or download the project as ZIP and extract
# Then navigate to the project directory
cd athaan-fi-beit

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 4. Configure Environment Variables

Edit the `.env` file:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/athaan_fi_beit
SESSION_SECRET=your-very-long-random-secret-key-here

# PayFast Configuration (South African Payment Gateway)
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_SANDBOX=true

# Notification Configuration
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:your-email@domain.com

# Development Mode
NODE_ENV=development
```

### 5. Initialize Database

```bash
# Create admin user
node create-admin.js

# Seed initial data (optional)
node seed-database.cjs
```

### 6. Start the Application

```bash
# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build
npm start
```

## Project Structure

```
athaan-fi-beit/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── lib/            # Utilities and configurations
│   │   └── App.tsx         # Main app component
├── server/                 # Express backend
│   ├── models/             # MongoDB models
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry point
├── pi-device/              # Raspberry Pi device code
├── shared/                 # Shared types and schemas
└── public/                 # Static assets
```

## Testing All Pages

### 1. Admin Dashboard

```bash
# Start the app
npm run dev

# Open browser and navigate to:
http://localhost:5000

# Test these URLs:
http://localhost:5000/admin/login
http://localhost:5000/demo
http://localhost:5000/customer
```

### 2. Admin Login
- URL: `http://localhost:5000/admin/login`
- Credentials: `admin` / `admin123`

### 3. Demo Dashboard
- URL: `http://localhost:5000/demo`
- Test navigation to all pages:
  - Users
  - Devices
  - Prayer Times
  - Audio Profiles
  - Technicians
  - Settings

### 4. Customer PWA
- URL: `http://localhost:5000/customer`
- Test features:
  - Prayer times display
  - Audio controls
  - Offline capabilities
  - Registration form

## Troubleshooting Common Issues

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Restart MongoDB
brew services restart mongodb/brew/mongodb-community

# Check MongoDB logs
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

### Port Already in Use

```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm run dev
```

### Node.js Version Issues

```bash
# Install Node Version Manager
brew install nvm

# Install and use Node 20
nvm install 20
nvm use 20

# Set as default
nvm alias default 20
```

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules
```

## Database Connection Options

### Local MongoDB (Development)
```
MONGODB_URI=mongodb://localhost:27017/athaan_fi_beit
```

### MongoDB Atlas (Production)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/athaan_fi_beit
```

### Docker MongoDB (Alternative)
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connection string
MONGODB_URI=mongodb://localhost:27017/athaan_fi_beit
```

## Development Workflow

### 1. Making Changes
- Frontend changes: Edit files in `client/src/`
- Backend changes: Edit files in `server/`
- Database changes: Update models in `server/models/`

### 2. Testing Changes
```bash
# Run tests (if available)
npm test

# Build for production
npm run build

# Start production server
npm start
```

### 3. Debugging
- Frontend: Use browser developer tools
- Backend: Check terminal console logs
- Database: Use MongoDB Compass or mongosh

## Production Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Set Environment Variables
```bash
export NODE_ENV=production
export MONGODB_URI="your-production-mongodb-uri"
export SESSION_SECRET="your-production-secret"
```

### 3. Start Production Server
```bash
npm start
```

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

## Getting Help

If you encounter issues:

1. Check the console logs for error messages
2. Verify all environment variables are set
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed
5. Try restarting the development server

The application should run smoothly on your Intel MacBook following these steps!