import mongoose from "mongoose";

const systemSettingsSchema = new mongoose.Schema({
  defaultPlayDuration: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const SystemSettings = mongoose.model("SystemSettings", systemSettingsSchema);
