import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  locationName: { type: String },
  firmwareVersion: { type: String },
  ipAddress: { type: String },
  online: { type: Boolean, default: false },
  socketId: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Device = mongoose.model("Device", deviceSchema);
