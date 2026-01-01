# MongoDB Version - Athaan Fi Beit

## Branch: mongodb-version

This branch contains a complete MongoDB implementation of the Athaan Fi Beit system using Mongoose instead of Drizzle/PostgreSQL.

## Changes Made

### ✅ Removed Dependencies
- `@neondatabase/serverless`
- `drizzle-orm`
- `drizzle-kit`
- `drizzle-zod`
- `connect-pg-simple`

### ✅ Added Dependencies
- `mongoose`
- `@types/mongoose`
- `connect-mongo`

### ✅ New MongoDB Models
- `server/models/User.ts` - User authentication data
- `server/models/CustomerProfile.ts` - Customer information and subscriptions
- `server/models/Device.ts` - IoT device management
- `server/models/PrayerTimes.ts` - Prayer schedules with location support
- `server/models/AudioProfile.ts` - Athaan audio file management
- `server/models/Technician.ts` - Service personnel data
- `server/models/ActivityLog.ts` - System activity tracking

### ✅ Updated Files
- `server/database.ts` - MongoDB connection with Mongoose
- `server/storage-mongodb.ts` - Complete MongoDB storage implementation
- `server/auth-mongodb.ts` - Authentication with MongoDB session store
- `server/routes.ts` - Updated to use MongoDB ObjectIds
- `server/index.ts` - MongoDB connection initialization
- `shared/schema.ts` - Zod validation schemas for MongoDB

### ✅ Removed Files
- `server/db.ts` - PostgreSQL connection
- `drizzle.config.ts` - Drizzle configuration

## Environment Variables

**IMPORTANT**: Update your `.env` file:
```bash
# MongoDB Connection (required) - Replace PostgreSQL URL with:
MONGODB_URI="mongodb://localhost:27017/athaan_fi_beit"
# or use MongoDB Atlas:
# MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/athaan_fi_beit"

# Keep existing variables
SESSION_SECRET="your_session_secret"
REPL_ID="your_repl_id"
REPLIT_DOMAINS="localhost:5000"
```

**Note**: The system is currently trying to use PostgreSQL URL for MongoDB connection. You need to set the proper MongoDB connection string to test this version.

## Setup Instructions

### 1. Install MongoDB
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Or use MongoDB Atlas cloud service
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Application
```bash
npm run dev
```

## API Changes

### MongoDB ObjectIds
- All ID parameters now use MongoDB ObjectId format
- Routes updated to handle string IDs instead of integers

### Example API Calls
```bash
# Create customer profile
POST /api/customer-profiles
{
  "membershipId": "MEM001",
  "fullName": "Ahmed Hassan",
  "email": "ahmed@example.com"
}

# Get devices
GET /api/devices

# Update device by ObjectId
PATCH /api/devices/64f1234567890abcdef12345
{
  "status": "maintenance"
}
```

## Data Relationships

### Mongoose References
- `CustomerProfile.userId` → `User.id`
- `Device.customerId` → `CustomerProfile._id`
- `Device.audioProfiles` → Array of `AudioProfile._id`

### Population Queries
```javascript
// Get devices with customer info
await Device.find().populate('customerId');

// Get customer with user data
await CustomerProfile.find().populate('userId');
```

## Key Differences from PostgreSQL Version

### Data Storage
- **PostgreSQL**: Relational tables with foreign keys
- **MongoDB**: Documents with embedded objects and references

### Session Management
- **PostgreSQL**: `connect-pg-simple`
- **MongoDB**: `connect-mongo`

### ID Fields
- **PostgreSQL**: Integer auto-increment IDs
- **MongoDB**: ObjectId strings

### Query Syntax
- **PostgreSQL**: `db.select().from(users).where(eq(users.id, id))`
- **MongoDB**: `User.findById(id)`

## Testing the MongoDB Version

### 1. Admin Dashboard
- Visit: http://localhost:5000/admin/login
- Test all CRUD operations
- Verify data persistence

### 2. API Testing
```bash
# Test user creation
curl -X POST http://localhost:5000/api/customer-profiles \
  -H "Content-Type: application/json" \
  -d '{"membershipId":"TEST001","fullName":"Test User","email":"test@example.com"}'

# Test device creation
curl -X POST http://localhost:5000/api/devices \
  -H "Content-Type: application/json" \
  -d '{"serialNumber":"DEV001","locationName":"Test Location"}'
```

### 3. Database Verification
```bash
# Connect to MongoDB
mongosh athaan_fi_beit

# Check collections
show collections

# View data
db.customerprofiles.find()
db.devices.find()
```

## Performance Considerations

### Indexes
- Compound indexes on prayer times (date + locationHash)
- Unique indexes on critical fields (email, membershipId)
- Text indexes for search functionality

### Aggregation Pipelines
- Dashboard statistics use MongoDB aggregation
- Complex queries leverage MongoDB's native operators

## Migration from PostgreSQL

To migrate existing data:
1. Export PostgreSQL data to JSON
2. Transform data format for MongoDB
3. Import using MongoDB tools
4. Verify data integrity

## Production Deployment

### MongoDB Atlas
1. Create cluster on MongoDB Atlas
2. Set `MONGODB_URI` to Atlas connection string
3. Configure network access and authentication

### Local MongoDB
1. Install MongoDB server
2. Configure replica set for sessions
3. Set up proper authentication

## Rollback Plan

To return to PostgreSQL version:
```bash
git checkout main
npm install
# Restore PostgreSQL database
npm run db:push
npm run dev
```

## Benefits of MongoDB Version

✅ **Schema Flexibility** - Easy to modify document structure
✅ **JSON Native** - Direct JSON storage without serialization
✅ **Horizontal Scaling** - Better scaling options with sharding
✅ **Aggregation** - Powerful data processing pipelines
✅ **Cloud Ready** - Easy deployment with MongoDB Atlas

## Potential Concerns

⚠️ **ACID Transactions** - Less strict than PostgreSQL
⚠️ **Learning Curve** - Different query patterns
⚠️ **Memory Usage** - Higher memory requirements
⚠️ **Backup Strategy** - Different backup/restore procedures

## Current Status

✅ **Complete** - All MongoDB models and controllers implemented
✅ **Dependencies** - Mongoose and connect-mongo installed, Drizzle removed
✅ **Files Created** - All 7 MongoDB models in server/models/
✅ **Schema Updated** - Zod validation schemas for MongoDB
✅ **Storage Layer** - Complete MongoDB storage implementation
✅ **Session Store** - MongoDB session management configured
✅ **Authentication** - Replit Auth updated for MongoDB

## Next Steps to Test

1. **Set MongoDB Connection**:
   ```bash
   # In .env file, replace DATABASE_URL with:
   MONGODB_URI="mongodb://localhost:27017/athaan_fi_beit"
   ```

2. **Install MongoDB** (if not using Atlas):
   ```bash
   brew install mongodb-community
   brew services start mongodb-community
   ```

3. **Start Application**:
   ```bash
   npm run dev
   ```

The MongoDB version is structurally complete and ready for testing once the connection string is updated!