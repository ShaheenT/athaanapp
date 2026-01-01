# Production Database Connection Guide

## Step-by-Step Database Setup for Athaan Fi Beit

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign up for a free account
   - Create a new project called "Athaan Fi Beit"

2. **Create Database Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier) or "Dedicated" (paid)
   - Select your preferred cloud provider and region
   - Name your cluster: `athaan-fi-beit-cluster`

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication method
   - Username: `athaan_admin`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development
   - For production, add your specific server IP addresses

5. **Get Connection String**
   - Go to "Databases" and click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as driver
   - Copy the connection string (looks like):
     ```
     mongodb+srv://athaan_admin:<password>@athaan-fi-beit-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password

6. **Update Environment Variables**
   - In your Replit project, go to the "Secrets" tab
   - Add a new secret:
     - Key: `MONGODB_URI`
     - Value: Your full connection string from step 5

### Option 2: Local MongoDB (Development Only)

1. **Install MongoDB on Mac (Intel)**
   ```bash
   # Install Homebrew if not already installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install MongoDB
   brew tap mongodb/brew
   brew install mongodb-community
   
   # Start MongoDB service
   brew services start mongodb/brew/mongodb-community
   ```

2. **Create Database and User**
   ```bash
   # Connect to MongoDB shell
   mongosh
   
   # Create database
   use athaan_fi_beit
   
   # Create admin user
   db.createUser({
     user: "athaan_admin",
     pwd: "your_secure_password",
     roles: ["readWrite", "dbAdmin"]
   })
   ```

3. **Set Environment Variable**
   ```bash
   export MONGODB_URI="mongodb://athaan_admin:your_secure_password@localhost:27017/athaan_fi_beit"
   ```

### Option 3: Replit Database (Not Recommended)

Replit's built-in database is PostgreSQL, but this project uses MongoDB. You would need to:

1. **Convert to PostgreSQL** (Major refactoring required)
   - Change all Mongoose models to Drizzle schemas
   - Update all database operations
   - Modify connection logic

### Verifying Database Connection

1. **Test Connection**
   - Your app should start without MongoDB connection errors
   - Check the console logs for "MongoDB connected successfully"

2. **Test Database Operations**
   - Go to `/admin/login` and login with `admin/admin123`
   - Navigate to different pages (Users, Devices, Prayer Times)
   - Try creating/editing records

### Troubleshooting Common Issues

1. **Connection Timeout**
   - Check your IP whitelist in MongoDB Atlas
   - Verify your connection string format
   - Ensure password doesn't contain special characters that need URL encoding

2. **Authentication Failed**
   - Double-check username and password
   - Verify the user has correct permissions
   - Check if the database name in connection string matches

3. **Network Issues**
   - For production: Add your server's IP to the whitelist
   - For development: Use 0.0.0.0/0 (allow all IPs)

### Security Best Practices

1. **For Production**
   - Use strong, unique passwords
   - Limit IP access to specific server IPs
   - Enable database-level authentication
   - Use SSL/TLS connections
   - Regular backup scheduling

2. **Environment Variables**
   - Never commit database credentials to code
   - Use environment variables for all sensitive data
   - Different credentials for dev/staging/production

### Next Steps After Database Setup

Once your database is connected:

1. **Initialize Data**
   - Run the admin user creation script: `node create-admin.js`
   - Upload initial prayer times data
   - Configure audio profiles

2. **Test All Features**
   - Admin dashboard functionality
   - User registration and payments
   - Device management
   - Prayer time calculations
   - Push notifications

3. **Configure Real-time Features**
   - WebSocket connections for device communication
   - Push notification service
   - Payment processing with PayFast
   - Automated prayer time calculations

The app will automatically use live data from your production database once connected, enabling all real-time features including device management, payment processing, and automated prayer notifications.