import mongoose from "mongoose";

const technicianSchema = new mongoose.Schema({
  employeeId: { type: String, unique: true, required: true },
  fullName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  phoneNumber: { type: String, required: true },
  specialization: { 
    type: String, 
    enum: ['installation', 'maintenance', 'support'], 
    default: 'installation' 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'on_leave'], 
    default: 'active' 
  },
  assignedRegions: [String],
  certifications: [String],
  hireDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Technician = mongoose.model("Technician", technicianSchema);