import mongoose from "mongoose";

const audioProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  language: { 
    type: String, 
    enum: ['arabic', 'english', 'urdu'], 
    required: true 
  },
  reciter: String,
  duration: Number, // in seconds
  fileSize: Number, // in bytes
  quality: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'high' 
  },
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const AudioProfile = mongoose.model("AudioProfile", audioProfileSchema);