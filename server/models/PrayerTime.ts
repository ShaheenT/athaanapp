import mongoose from "mongoose";

const prayerTimeSchema = new mongoose.Schema({
  prayerName: { type: String, required: true },
  madhab: { type: String, enum: ['hanafi', 'shafi'], default: 'hanafi' },
  audioName: { type: String },
  audioUrl: { type: String },
  dateTime: { type: Date, required: true },
  durationSeconds: { type: Number, default: 60 },
  triggered: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

prayerTimeSchema.index({ dateTime: 1, triggered: 1 });

export const PrayerTime = mongoose.model("PrayerTime", prayerTimeSchema);
