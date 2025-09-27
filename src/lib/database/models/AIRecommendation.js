// src/lib/database/models/AIRecommendation.js
import mongoose from 'mongoose';

const AIRecommendationSchema = new mongoose.Schema({
  recommendationId: {
    type: String,
    required: true,
    unique: true
  },
  
  type: {
    type: String,
    enum: ['PRIORITY', 'ROUTING', 'SCHEDULING', 'EMERGENCY', 'OPTIMIZATION'],
    required: true
  },
  
  title: {
    type: String,
    required: true,
    maxLength: 100
  },
  
  description: {
    type: String,
    required: true,
    maxLength: 500
  },
  
  impact: {
    type: String,
    required: true
  },
  
  confidence: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  }, // percentage
  
  urgency: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    required: true
  },
  
  targetTrains: [String],
  
  estimatedBenefit: {
    throughputImprovement: { type: Number, default: 0 }, // percentage
    delayReduction: { type: Number, default: 0 }, // minutes
    efficiencyGain: { type: Number, default: 0 } // percentage
  },
  
  action: String, // Action identifier for execution
  
  executed: {
    type: Boolean,
    default: false
  },
  
  executionTime: Date,
  
  scenario: {
    type: String,
    enum: ['normal', 'congestion', 'emergency', 'optimized'],
    default: 'normal'
  }
}, {
  timestamps: true,
  collection: 'ai_recommendations'
});

export default mongoose.models.AIRecommendation || mongoose.model('AIRecommendation', AIRecommendationSchema);
