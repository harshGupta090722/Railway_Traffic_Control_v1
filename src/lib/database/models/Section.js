// src/lib/database/models/Section.js
import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: [true, 'Section ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  
  name: {
    type: String,
    required: [true, 'Section name is required'],
    trim: true
  },
  
  // Physical Properties
  length: {
    type: Number,
    required: [true, 'Section length is required'],
    min: [0.1, 'Length must be at least 0.1 km']
  }, // in kilometers
  
  maxSpeed: {
    type: Number,
    required: [true, 'Maximum speed is required'],
    min: [20, 'Max speed must be at least 20 km/h']
  }, // km/h
  
  capacity: {
    type: Number,
    required: [true, 'Section capacity is required'],
    min: [1, 'Capacity must be at least 1 train']
  }, // max trains simultaneously
  
  currentLoad: {
    type: Number,
    default: 0,
    min: [0, 'Current load cannot be negative']
  },
  
  // Block Management
  blocks: [{
    blockId: { type: String, required: true },
    occupied: { type: Boolean, default: false },
    trainId: String,
    signalStatus: {
      type: String,
      enum: ['GREEN', 'YELLOW', 'RED'],
      default: 'GREEN'
    },
    length: { type: Number, default: 1 } // km
  }],
  
  // Platform Information
  platforms: [{
    platformId: { type: String, required: true },
    occupied: { type: Boolean, default: false },
    trainId: String,
    type: {
      type: String,
      enum: ['PASSENGER', 'FREIGHT', 'MAINTENANCE'],
      default: 'PASSENGER'
    },
    capacity: { type: Number, default: 1 }
  }],
  
  // Conflict Zones
  conflictZones: [{
    zoneId: { type: String, required: true },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW'
    },
    conflictingTrains: [String],
    location: String,
    estimatedResolutionTime: { type: Number, default: 0 } // minutes
  }],
  
  // Operational Status
  status: {
    type: String,
    enum: ['NORMAL', 'CONGESTED', 'BLOCKED', 'MAINTENANCE'],
    default: 'NORMAL'
  },
  
  // Performance Metrics
  throughputTarget: { type: Number, default: 10 }, // trains per hour
  currentThroughput: { type: Number, default: 0 },
  averageDelay: { type: Number, default: 0 } // minutes
}, {
  timestamps: true,
  collection: 'sections'
});

// Indexes
SectionSchema.index({ sectionId: 1 });
SectionSchema.index({ status: 1 });
SectionSchema.index({ 'blocks.trainId': 1 });

// Virtual for utilization percentage
SectionSchema.virtual('utilizationRate').get(function() {
  return Math.min((this.currentLoad / this.capacity) * 100, 100);
});

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);
