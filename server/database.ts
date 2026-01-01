import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUrl = process.env.MONGODB_URI;
  if (!mongoUrl) throw new Error("MONGODB_URI is not defined in environment variables");

  console.log('Connecting to MongoDB:', mongoUrl);
  try {
    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB Atlas successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw error;
  }
}
