// src/lib/database/models/Conflict.js
import mongoose from 'mongoose';

const ConflictSchema = new mongoose.Schema({
  conflictId: {
    type: String,
    required: true,
    unique: true
  },
  
  type: {
    type: String,
    enum: ['CROSSING', 'OVERTAKING', 'PLATFORM_CONFLICT', 'SPEED_CONFLICT', 'EMERGENCY'],
    required: true
  },
  
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  
  involvedTrains: [{
    type: String,
    required: true
  }],
  
  location: {
    sectionId: String,
    blockId: String,
    coordinates: {
      x: Number,
      y: Number,
      z: Number
    }
  },
  
  estimatedResolutionTime: {
    type: Number,
    default: 0 // minutes
  },
  
  aiRecommendations: [String],
  
  status: {
    type: String,
    enum: ['ACTIVE', 'RESOLVING', 'RESOLVED'],
    default: 'ACTIVE'
  },
  
  resolutionActions: [{
    action: String,
    timestamp: Date,
    executedBy: String
  }],
  
  potentialDelay: Number, // minutes
  impactedTrains: [String]
}, {
  timestamps: true,
  collection: 'conflicts'
});

export default mongoose.models.Conflict || mongoose.model('Conflict', ConflictSchema);
