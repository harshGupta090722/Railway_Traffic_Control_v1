// src/lib/database/models/DemoScenario.js
import mongoose from 'mongoose';

const DemoScenarioSchema = new mongoose.Schema({
  scenarioId: {
    type: String,
    required: true,
    unique: true
  },
  
  name: {
    type: String,
    required: true
  },
  
  description: {
    type: String,
    required: true
  },
  
  duration: {
    type: Number,
    default: 60 // seconds
  },
  
  initialState: {
    trains: [mongoose.Schema.Types.Mixed],
    sections: [mongoose.Schema.Types.Mixed],
    conflicts: [mongoose.Schema.Types.Mixed]
  },
  
  expectedMetrics: {
    throughputImprovement: Number,
    delayReduction: Number,
    conflictResolution: Number
  },
  
  aiRecommendations: [mongoose.Schema.Types.Mixed],
  
  keyMoments: [{
    timestamp: Number, // seconds from start
    event: String,
    description: String,
    visualHighlight: Boolean
  }],
  
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  collection: 'demo_scenarios'
});

export default mongoose.models.DemoScenario || mongoose.model('DemoScenario', DemoScenarioSchema);
