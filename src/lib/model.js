// Railway system data structure definitions for JavaScript

// Train model structure
export const createTrain = (trainData) => ({
  id: trainData.id || '',
  name: trainData.name || '',
  type: trainData.type || 'LOCAL', // 'EXPRESS' | 'LOCAL' | 'FREIGHT' | 'MAINTENANCE'
  currentSection: trainData.currentSection || '',
  currentPosition: {
    x: trainData.currentPosition?.x || 0,
    y: trainData.currentPosition?.y || 0,
    z: trainData.currentPosition?.z || 0,
  },
  speed: trainData.speed || 0, // km/h
  delay: trainData.delay || 0, // minutes
  status: trainData.status || 'STOPPED', // 'RUNNING' | 'STOPPED' | 'DELAYED' | 'MAINTENANCE'
  destination: trainData.destination || '',
  passengerCount: trainData.passengerCount || 0,
  cargoTons: trainData.cargoTons || 0,
  priority: trainData.priority || 5, // 1-10
  route: trainData.route || [],
  schedule: {
    departureTime: trainData.schedule?.departureTime || new Date(),
    arrivalTime: trainData.schedule?.arrivalTime || new Date(),
    stations: trainData.schedule?.stations || []
  }
});

// Section model structure
export const createSection = (sectionData) => ({
  id: sectionData.id || '',
  name: sectionData.name || '',
  capacity: sectionData.capacity || 1,
  currentLoad: sectionData.currentLoad || 0,
  maxSpeed: sectionData.maxSpeed || 60, // km/h
  length: sectionData.length || 1, // km
  blocks: sectionData.blocks || [],
  platforms: sectionData.platforms || [],
  conflictZones: sectionData.conflictZones || [],
  status: sectionData.status || 'NORMAL' // 'NORMAL' | 'CONGESTED' | 'BLOCKED' | 'MAINTENANCE'
});

// Block model structure  
export const createBlock = (blockData) => ({
  blockId: blockData.blockId || '',
  occupied: blockData.occupied || false,
  trainId: blockData.trainId || null,
  signalStatus: blockData.signalStatus || 'GREEN', // 'GREEN' | 'YELLOW' | 'RED'
  length: blockData.length || 1
});

// Platform model structure
export const createPlatform = (platformData) => ({
  platformId: platformData.platformId || '',
  occupied: platformData.occupied || false,
  trainId: platformData.trainId || null,
  type: platformData.type || 'PASSENGER', // 'PASSENGER' | 'FREIGHT' | 'MAINTENANCE'
  capacity: platformData.capacity || 1
});

// Conflict Zone model structure
export const createConflictZone = (conflictData) => ({
  zoneId: conflictData.zoneId || '',
  riskLevel: conflictData.riskLevel || 'LOW', // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  conflictingTrains: conflictData.conflictingTrains || [],
  estimatedResolutionTime: conflictData.estimatedResolutionTime || 0, // minutes
  location: conflictData.location || ''
});

// AI Recommendation model structure
export const createAIRecommendation = (recommendationData) => ({
  id: recommendationData.id || '',
  type: recommendationData.type || 'OPTIMIZATION', // 'PRIORITY' | 'ROUTING' | 'SCHEDULING' | 'EMERGENCY' | 'OPTIMIZATION'
  title: recommendationData.title || '',
  description: recommendationData.description || '',
  impact: recommendationData.impact || '',
  confidence: recommendationData.confidence || 0, // percentage
  urgency: recommendationData.urgency || 'LOW', // 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  action: recommendationData.action || null,
  targetTrains: recommendationData.targetTrains || [],
  estimatedBenefit: {
    throughputImprovement: recommendationData.estimatedBenefit?.throughputImprovement || 0,
    delayReduction: recommendationData.estimatedBenefit?.delayReduction || 0,
    efficiencyGain: recommendationData.estimatedBenefit?.efficiencyGain || 0
  },
  executed: recommendationData.executed || false,
  executionTime: recommendationData.executionTime || null
});

// Performance Metrics model structure
export const createPerformanceMetrics = (metricsData) => ({
  throughput: metricsData.throughput || 0, // percentage
  averageDelay: metricsData.averageDelay || 0, // minutes  
  efficiency: metricsData.efficiency || 0, // percentage
  conflicts: metricsData.conflicts || 0,
  totalTrains: metricsData.totalTrains || 0,
  activeTrains: metricsData.activeTrains || 0,
  sectionsUtilized: metricsData.sectionsUtilized || 0,
  timestamp: metricsData.timestamp || new Date()
});

// Demo Scenario model structure
export const createDemoScenario = (scenarioData) => ({
  id: scenarioData.id || '',
  name: scenarioData.name || '',
  description: scenarioData.description || '',
  duration: scenarioData.duration || 60, // seconds
  trains: scenarioData.trains || [],
  sections: scenarioData.sections || [],
  conflicts: scenarioData.conflicts || [],
  expectedMetrics: scenarioData.expectedMetrics || createPerformanceMetrics({}),
  aiRecommendations: scenarioData.aiRecommendations || []
});

// API Response structure
export const createApiResponse = (responseData) => ({
  success: responseData.success || false,
  data: responseData.data || null,
  error: responseData.error || null,
  message: responseData.message || null,
  timestamp: responseData.timestamp || new Date()
});

// WebSocket Message structure
export const createWebSocketMessage = (messageData) => ({
  type: messageData.type || 'TRAIN_UPDATE', // 'TRAIN_UPDATE' | 'CONFLICT_DETECTED' | 'AI_RECOMMENDATION' | 'SCENARIO_CHANGE' | 'METRICS_UPDATE'
  payload: messageData.payload || {},
  timestamp: messageData.timestamp || new Date()
});

// Validation functions
export const validateTrain = (train) => {
  return (
    train.id && 
    train.name && 
    ['EXPRESS', 'LOCAL', 'FREIGHT', 'MAINTENANCE'].includes(train.type) &&
    ['RUNNING', 'STOPPED', 'DELAYED', 'MAINTENANCE'].includes(train.status)
  );
};

export const validateSection = (section) => {
  return (
    section.id && 
    section.name && 
    section.capacity > 0 &&
    section.maxSpeed > 0 &&
    ['NORMAL', 'CONGESTED', 'BLOCKED', 'MAINTENANCE'].includes(section.status)
  );
};

// Constants for the application
export const TRAIN_TYPES = {
  EXPRESS: 'EXPRESS',
  LOCAL: 'LOCAL', 
  FREIGHT: 'FREIGHT',
  MAINTENANCE: 'MAINTENANCE'
};

export const TRAIN_STATUSES = {
  RUNNING: 'RUNNING',
  STOPPED: 'STOPPED',
  DELAYED: 'DELAYED',
  MAINTENANCE: 'MAINTENANCE'
};

export const SIGNAL_STATUSES = {
  GREEN: 'GREEN',
  YELLOW: 'YELLOW', 
  RED: 'RED'
};

export const URGENCY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};