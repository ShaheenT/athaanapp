import mongoose from "mongoose";

const prayerTimesSchema = new mongoose.Schema({
  date: { type: String, required: true },
  locationName: { type: String, required: true },
  locationHash: String,
  fajrTime: { type: String, required: true },
  dhuhrTime: { type: String, required: true },
  asrTime: { type: String, required: true },
  maghribTime: { type: String, required: true },
  ishaTime: { type: String, required: true },
  sunriseTime: String,
  sunsetTime: String,
  source: { 
    type: String, 
    enum: ['aladhan_api', 'manual_upload', 'csv_import'], 
    default: 'aladhan_api' 
  },
  hijriDate: {
    date: String,
    month: String,
    year: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Compound index for efficient queries
prayerTimesSchema.index({ date: 1, locationHash: 1 }, { unique: true });

export const PrayerTimes = mongoose.model("PrayerTimes", prayerTimesSchema);