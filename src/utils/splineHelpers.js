// src/utils/splineHelpers.js
'use client';

/**
 * Utility functions for Spline 3D scene management
 */

// Color conversion utilities
export const hexToThreeColor = (hex) => {
  return parseInt(hex.replace('#', '0x'));
};

export const getScenarioColors = (scenario, aiMode = false) => {
  const colors = {
    normal: {
      track: '#666666',
      ambient: '#ffffff',
      emissive: 0.0
    },
    congestion: {
      track: '#ffaa00',
      ambient: '#ffeeaa',
      emissive: 0.1
    },
    emergency: {
      track: '#ff4444',
      ambient: '#ff9999',
      emissive: 0.2
    },
    optimized: {
      track: aiMode ? '#44ff44' : '#666666',
      ambient: aiMode ? '#eeffff' : '#ffffff',
      emissive: aiMode ? 0.1 : 0.0
    }
  };
  
  return colors[scenario] || colors.normal;
};

// Train status utilities
export const getTrainStatusColor = (train) => {
  if (train.emergency) return '#ff0000';
  if (train.optimized) return '#00ff44';
  if (train.conflicted) return '#ffaa00';
  return train.color || '#666666';
};

export const getSignalColor = (train) => {
  if (train.emergency || train.conflicted) return 0xff0000; // Red
  if (train.status === 'DELAYED') return 0xffff00; // Yellow
  if (train.optimized) return 0x00ff00; // Green
  return 0x00ff00; // Default green
};

// Animation utilities
export const calculateTrainMovement = (train, deltaTime, speed = 1.0) => {
  if (!train.position || train.status === 'STOPPED' || train.status === 'HOLDING') {
    return train.position;
  }

  const movement = (train.speed * deltaTime * speed) / 1000; // Convert to reasonable scale
  
  return {
    x: train.position.x + movement,
    y: train.position.y || 0,
    z: train.position.z || 0
  };
};

export const interpolatePosition = (current, target, factor = 0.1) => {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
    z: current.z + (target.z - current.z) * factor
  };
};

// Camera position presets
export const getCameraPresets = () => ({
  overview: {
    position: { x: 0, y: 80, z: 120 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 60
  },
  track: {
    position: { x: -20, y: 8, z: 25 },
    lookAt: { x: -20, y: 0, z: 0 },
    fov: 75
  },
  station: {
    position: { x: 50, y: 20, z: 40 },
    lookAt: { x: 50, y: 0, z: 0 },
    fov: 60
  },
  junction: {
    position: { x: 0, y: 30, z: 30 },
    lookAt: { x: 0, y: 0, z: 0 },
    fov: 70
  }
});

// Performance calculation utilities
export const calculateScenarioMetrics = (trains, scenario, aiMode) => {
  const runningTrains = trains.filter(t => 
    t.status === 'RUNNING' || t.status === 'OPTIMIZED' || t.status === 'EMERGENCY'
  );
  
  const throughput = Math.min((runningTrains.length / trains.length) * 100, 100);
  
  const baseEfficiency = {
    normal: 85,
    congestion: 65,
    emergency: 40,
    optimized: aiMode ? 95 : 75
  };
  
  const efficiency = baseEfficiency[scenario] || 85;
  
  const conflicts = trains.filter(t => t.conflicted).length;
  const optimizedTrains = trains.filter(t => t.optimized).length;
  
  return {
    throughput: Math.round(throughput),
    efficiency: Math.round(efficiency),
    conflicts,
    optimizedTrains,
    activeTrains: runningTrains.length,
    totalTrains: trains.length
  };
};

// Validation utilities
export const validateSplineScene = (splineApp) => {
  const requiredObjects = [
    'train-EXP001', 'train-LOC002', 'train-FRG003', 'train-EXP004',
    'signal-EXP001', 'signal-LOC002', 'signal-FRG003', 'signal-EXP004',
    'main-track', 'Camera'
  ];
  
  const missingObjects = [];
  
  requiredObjects.forEach(objectName => {
    if (!splineApp.findObjectByName(objectName)) {
      missingObjects.push(objectName);
    }
  });
  
  if (missingObjects.length > 0) {
    console.warn('⚠️ Missing Spline objects:', missingObjects);
    return false;
  }
  
  console.log('✅ All required Spline objects found');
  return true;
};

// Error handling utilities
export const handleSplineError = (error, fallbackCallback) => {
  console.error('Spline Error:', error);
  
  if (fallbackCallback && typeof fallbackCallback === 'function') {
    fallbackCallback();
  }
  
  return {
    type: 'SPLINE_ERROR',
    message: error.message || 'Unknown Spline error',
    timestamp: new Date().toISOString()
  };
};

// Export all utilities
export default {
  hexToThreeColor,
  getScenarioColors,
  getTrainStatusColor,
  getSignalColor,
  calculateTrainMovement,
  interpolatePosition,
  getCameraPresets,
  calculateScenarioMetrics,
  validateSplineScene,
  handleSplineError
};
