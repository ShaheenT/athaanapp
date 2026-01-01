import { MongoClient } from 'mongodb';
import crypto from 'crypto';

// Simple password hashing function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function createAdminUser() {
  const client = new MongoClient('mongodb://localhost:27017');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('athaan_fi_beit');
    
    // Create admin user
    const adminUser = {
      username: 'admin',
      password: hashPassword('admin123'),
      email: 'admin@athaanfibeit.com',
      role: 'admin',
      fullName: 'System Administrator',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      console.log('Username: admin');
      console.log('Password: admin123');
    } else {
      await db.collection('users').insertOne(adminUser);
      console.log('✅ Admin user created successfully!');
      console.log('Username: admin');
      console.log('Password: admin123');
    }
    
    // Create customer profile for admin
    const adminProfile = {
      userId: adminUser._id,
      email: 'admin@athaanfibeit.com',
      fullName: 'System Administrator',
      phoneNumber: '+27821234567',
      membershipId: 'ADMIN001',
      location: 'Cape Town',
      accountEnabled: true,
      paymentStatus: 'active',
      subscriptionType: 'lifetime',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const existingProfile = await db.collection('customerprofiles').findOne({ email: 'admin@athaanfibeit.com' });
    
    if (!existingProfile) {
      await db.collection('customerprofiles').insertOne(adminProfile);
      console.log('✅ Admin profile created successfully!');
    } else {
      console.log('Admin profile already exists');
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser();