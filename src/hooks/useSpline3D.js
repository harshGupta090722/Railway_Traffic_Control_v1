// src/hooks/useSpline3D.js
'use client';
import { useState, useEffect, useCallback } from 'react';

export function useSpline3D(scenario, aiMode) {
  const [trains, setTrains] = useState([]);
  const [sceneReady, setSceneReady] = useState(false);

  // Generate realistic train data based on scenario
  const generateScenarioData = useCallback((currentScenario, currentAiMode) => {
    const baseTrains = [
      {
        id: 'EXP001',
        name: 'Rajdhani Express',
        type: 'EXPRESS',
        position: { x: -80 + Math.random() * 10, y: 0, z: 0 },
        speed: 85,
        color: '#ff4444',
        priority: 8,
        passengers: 1250,
        destination: 'New Delhi'
      },
      {
        id: 'LOC002',
        name: 'Local Passenger',
        type: 'LOCAL',
        position: { x: -40 + Math.random() * 10, y: 0, z: 6 },
        speed: 60,
        color: '#4444ff',
        priority: 5,
        passengers: 890,
        destination: 'Suburban Station'
      },
      {
        id: 'FRG003',
        name: 'Freight Express',
        type: 'FREIGHT',
        position: { x: 40 + Math.random() * 10, y: 0, z: -6 },
        speed: 45,
        color: '#44ff44',
        priority: 3,
        cargo: 2400,
        destination: 'Industrial Hub'
      },
      {
        id: 'EXP004',
        name: 'Shatabdi Express',
        type: 'EXPRESS',
        position: { x: 80 + Math.random() * 10, y: 0, z: 0 },
        speed: 90,
        color: '#ff8800',
        priority: 9,
        passengers: 1100,
        destination: 'Business District'
      }
    ];

    // Modify trains based on scenario
    const modifiedTrains = baseTrains.map(train => {
      let modifiedTrain = { ...train };

      switch (currentScenario) {
        case 'congestion':
          modifiedTrain.speed *= 0.6;
          modifiedTrain.conflicted = Math.random() < 0.4;
          modifiedTrain.delay = Math.random() < 0.3 ? Math.floor(Math.random() * 8) + 2 : 0;
          modifiedTrain.status = modifiedTrain.delay > 0 ? 'DELAYED' : 'RUNNING';
          break;

        case 'emergency':
          if (train.id === 'EXP001') {
            modifiedTrain.emergency = true;
            modifiedTrain.speed *= 1.5;
            modifiedTrain.priority = 10;
            modifiedTrain.color = '#ff0000';
            modifiedTrain.status = 'EMERGENCY';
          } else {
            modifiedTrain.speed *= 0.3;
            modifiedTrain.status = 'HOLDING';
          }
          break;

        case 'optimized':
          if (currentAiMode) {
            modifiedTrain.speed *= 1.3;
            modifiedTrain.optimized = true;
            modifiedTrain.delay = Math.max(0, (modifiedTrain.delay || 0) - 5);
            modifiedTrain.efficiency = 95 + Math.random() * 5;
            modifiedTrain.status = 'OPTIMIZED';
          }
          break;

        default: // normal
          modifiedTrain.status = 'RUNNING';
          break;
      }

      return modifiedTrain;
    });

    // Generate conflicts
    const conflicts = [];
    if (currentScenario === 'congestion') {
      conflicts.push(
        {
          id: 'conflict-001',
          type: 'CROSSING',
          severity: 'HIGH',
          involvedTrains: ['EXP001', 'LOC002'],
          location: 'Junction Alpha'
        },
        {
          id: 'conflict-002', 
          type: 'PLATFORM_CONFLICT',
          severity: 'MEDIUM',
          involvedTrains: ['FRG003'],
          location: 'Central Station'
        }
      );
    } else if (currentScenario === 'emergency') {
      conflicts.push({
        id: 'emergency-001',
        type: 'EMERGENCY',
        severity: 'CRITICAL',
        involvedTrains: ['EXP001'],
        location: 'Emergency Corridor'
      });
    }

    return {
      trains: modifiedTrains,
      conflicts: conflicts,
      scenario: currentScenario,
      aiMode: currentAiMode,
      timestamp: Date.now()
    };
  }, []);

  // Update train positions for animation
  const updateTrainPositions = useCallback((speed = 1.0) => {
    setTrains(prevTrains =>
      prevTrains.map(train => {
        if (train.status === 'RUNNING' || train.status === 'OPTIMIZED' || train.status === 'EMERGENCY') {
          const movement = (train.speed * 0.1 * speed) / 10; // Scaled for demo
          
          return {
            ...train,
            position: {
              ...train.position,
              x: train.position.x + movement
            }
          };
        }
        return train;
      })
    );
  }, []);

  // Handle scenario changes
  const handleScenarioChange = useCallback((newScenario, newAiMode) => {
    const newData = generateScenarioData(newScenario, newAiMode);
    setTrains(newData.trains);
  }, [generateScenarioData]);

  // Initialize trains when hook mounts
  useEffect(() => {
    const initialData = generateScenarioData(scenario, aiMode);
    setTrains(initialData.trains);
    setSceneReady(true);
  }, [scenario, aiMode, generateScenarioData]);

  return {
    trains,
    sceneReady,
    updateTrainPositions,
    generateScenarioData,
    handleScenarioChange
  };
}
