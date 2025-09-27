// src/components/3d/Railway3DVisualization.js
'use client';
import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, CircularProgress, Fab, Chip, Card, CardContent } from '@mui/material';
import { 
  Speed, Pause, PlayArrow, Refresh, Visibility, 
  Train as TrainIcon, Warning, CheckCircle 
} from '@mui/icons-material';
import Spline from '@spline-tool/react-spline';

export default function Railway3DVisualization({ 
  scenario, 
  aiMode, 
  trafficData, 
  demoRunning 
}) {
  const [loading, setLoading] = useState(true);
  const [trains, setTrains] = useState([]);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [viewMode, setViewMode] = useState('overview');
  const [splineError, setSplineError] = useState(false);
  const splineRef = useRef(null);
  
  // Spline scene URL - You'll create this in Spline with railway tracks, trains, and signals
  const splineSceneUrl = 'https://prod.spline.design/your-railway-scene-url/scene.splinecode';
  
  // Generate realistic train movements based on scenario
  useEffect(() => {
    const generateTrainMovements = () => {
      const baseTrains = [
        {
          id: 'EXP001',
          name: 'Rajdhani Express',
          type: 'EXPRESS',
          x: -50,
          z: 0,
          speed: 80,
          color: '#ff4444',
          priority: 8,
          passengers: 1250
        },
        {
          id: 'LOC002',
          name: 'Local Passenger',
          type: 'LOCAL',
          x: -30,
          z: 10,
          speed: 60,
          color: '#4444ff',
          priority: 5,
          passengers: 890
        },
        {
          id: 'FRG003',
          name: 'Freight Express',
          type: 'FREIGHT',
          x: -70,
          z: -10,
          speed: 40,
          color: '#44ff44',
          priority: 3,
          cargo: 2400
        },
        {
          id: 'EXP004',
          name: 'Shatabdi Express',
          type: 'EXPRESS',
          x: 20,
          z: 5,
          speed: 85,
          color: '#ff4444',
          priority: 9,
          passengers: 1100
        }
      ];

      let modifiedTrains = [...baseTrains];

      // Modify train positions and behavior based on scenario
      switch (scenario) {
        case 'congestion':
          modifiedTrains = modifiedTrains.map(train => ({
            ...train,
            speed: train.speed * 0.6, // Reduce speed due to congestion
            conflicted: Math.random() < 0.4, // 40% chance of conflict
            delay: Math.random() < 0.3 ? Math.floor(Math.random() * 10) + 2 : 0
          }));
          break;
          
        case 'emergency':
          // First train gets emergency priority
          modifiedTrains[0].priority = true;
          modifiedTrains[0].speed *= 1.5;
          modifiedTrains[0].emergency = true;
          modifiedTrains[0].color = '#ff0000';
          
          // Other trains slow down or stop
          modifiedTrains.slice(1).forEach(train => {
            train.speed *= 0.3;
            train.status = 'HOLDING';
          });
          break;
          
        case 'optimized':
          if (aiMode) {
            modifiedTrains = modifiedTrains.map(train => ({
              ...train,
              speed: train.speed * 1.3, // AI optimization increases efficiency
              optimized: true,
              delay: Math.max(0, train.delay - 5), // Reduce delays
              color: train.type === 'EXPRESS' ? '#00ff00' : train.color
            }));
          }
          break;
          
        default: // normal
          // Keep base configuration
          break;
      }

      return modifiedTrains;
    };

    // Update train positions every second for smooth movement
    const updateInterval = setInterval(() => {
      setTrains(generateTrainMovements());
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [scenario, aiMode]);

  // Handle Spline scene loading and object manipulation
  const onLoad = (splineApp) => {
    setLoading(false);
    splineRef.current = splineApp;
    
    try {
      // Update 3D objects based on train data
      trains.forEach((train) => {
        try {
          // Find train object in Spline scene
          const trainObject = splineApp.findObjectByName(`train-${train.id}`);
          
          if (trainObject) {
            // Update position with smooth animation
            trainObject.position.x = train.x;
            trainObject.position.z = train.z;
            
            // Update color based on status
            if (train.conflicted) {
              trainObject.material.color.setHex(0xff0000); // Red for conflict
            } else if (train.optimized) {
              trainObject.material.color.setHex(0x00ff00); // Green for optimized
            } else if (train.priority || train.emergency) {
              trainObject.material.color.setHex(0xffaa00); // Orange for priority
            } else {
              trainObject.material.color.setHex(parseInt(train.color.replace('#', '0x')));
            }
            
            // Update signal lights
            const signal = splineApp.findObjectByName(`signal-${train.id}`);
            if (signal) {
              const signalColor = train.conflicted ? 0xff0000 : 
                                 train.optimized ? 0x00ff00 : 0xffff00;
              signal.material.emissive.setHex(signalColor);
            }
            
            // Add particle effects for AI optimization
            if (train.optimized && aiMode) {
              const particles = splineApp.findObjectByName(`particles-${train.id}`);
              if (particles) {
                particles.visible = true;
              }
            }
          }
        } catch (error) {
          console.warn(`Could not update 3D object for train ${train.id}:`, error);
        }
      });

      // Update track colors based on scenario
      const mainTrack = splineApp.findObjectByName('main-track');
      if (mainTrack) {
        switch (scenario) {
          case 'congestion':
            mainTrack.material.color.setHex(0xffaa00); // Orange for congestion
            break;
          case 'emergency':
            mainTrack.material.color.setHex(0xff0000); // Red for emergency
            break;
          case 'optimized':
            if (aiMode) {
              mainTrack.material.color.setHex(0x00ff00); // Green for optimized
            }
            break;
          default:
            mainTrack.material.color.setHex(0x666666); // Default gray
        }
      }
      
    } catch (error) {
      console.error('Error updating 3D scene:', error);
      setSplineError(true);
    }
  };

  // Handle view mode changes
  const changeViewMode = (mode) => {
    setViewMode(mode);
    if (splineRef.current) {
      try {
        const camera = splineRef.current.findObjectByName('Camera');
        if (camera) {
          switch (mode) {
            case 'overview':
              camera.position.set(0, 100, 100);
              camera.lookAt(0, 0, 0);
              break;
            case 'track':
              camera.position.set(-20, 20, 20);
              camera.lookAt(-20, 0, 0);
              break;
            case 'station':
              camera.position.set(50, 30, 50);
              camera.lookAt(50, 0, 0);
              break;
          }
        }
      } catch (error) {
        console.warn('Could not change camera view:', error);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', bgcolor: '#f5f5f5', borderRadius: 1 }}>
      {/* Loading State */}
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading Railway Network...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {splineError && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <Warning sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
          <Typography variant="h6">3D Scene Loading Failed</Typography>
          <Typography variant="body2" color="text.secondary">
            Displaying simulation data instead
          </Typography>
        </Box>
      )}

      {/* Spline 3D Scene */}
      {!splineError && (
        <Spline
          scene={splineSceneUrl}
          onLoad={onLoad}
          onError={() => setSplineError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '4px'
          }}
        />
      )}

      {/* Fallback 2D Visualization when Spline fails */}
      {splineError && (
        <Box sx={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          {/* Simulated Railway Track */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Main track lines */}
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#fff" strokeWidth="4" />
            <line x1="10%" y1="55%" x2="90%" y2="55%" stroke="#fff" strokeWidth="4" />
            
            {/* Track switches */}
            <path d="M 30% 50% L 40% 30%" stroke="#fff" strokeWidth="3" />
            <path d="M 60% 50% L 70% 70%" stroke="#fff" strokeWidth="3" />
            
            {/* Animated trains */}
            {trains.map((train, index) => (
              <g key={train.id}>
                <rect
                  x={`${30 + (index * 15)}%`}
                  y="45%"
                  width="8%"
                  height="10%"
                  fill={train.color}
                  rx="2"
                  style={{
                    animation: demoRunning ? `moveRight-${index} 10s infinite linear` : 'none'
                  }}
                />
                <text
                  x={`${32 + (index * 15)}%`}
                  y="52%"
                  fill="white"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {train.type.substring(0, 3)}
                </text>
              </g>
            ))}
          </svg>
        </Box>
      )}

      {/* Overlay Information Panel */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        p: 2,
        borderRadius: 2,
        minWidth: 250,
        boxShadow: 2
      }}>
        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
          Live Network Status
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Active Trains: ${trains.length}`}
            size="small"
            color="primary"
          />
          <Chip
            label={`Scenario: ${scenario}`}
            size="small"
            color={scenarios[scenario]?.color || 'default'}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          AI Mode: {aiMode ? 'Enabled' : 'Disabled'}
        </Typography>
        
        {trains.filter(t => t.conflicted).length > 0 && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            ⚠️ Conflicts: {trains.filter(t => t.conflicted).length}
          </Typography>
        )}
        
        {trains.filter(t => t.optimized).length > 0 && (
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            ✅ Optimized: {trains.filter(t => t.optimized).length}
          </Typography>
        )}
      </Box>

      {/* Control Panel */}
      <Box sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        display: 'flex',
        gap: 1,
        flexDirection: 'column'
      }}>
        {/* View Controls */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Fab
            size="small"
            color={viewMode === 'overview' ? 'primary' : 'default'}
            onClick={() => changeViewMode('overview')}
          >
            <Visibility />
          </Fab>
          <Fab
            size="small"
            color="secondary"
            onClick={() => setAnimationSpeed(animationSpeed === 1 ? 2 : 1)}
          >
            <Speed />
          </Fab>
        </Box>

        {/* Animation Speed Indicator */}
        {animationSpeed !== 1 && (
          <Chip
            label={`${animationSpeed}x Speed`}
            size="small"
            color="secondary"
            sx={{ alignSelf: 'center' }}
          />
        )}
      </Box>

      {/* Performance Indicator */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        display: 'flex',
        gap: 1
      }}>
        {aiMode && scenario === 'optimized' && (
          <Card sx={{ bgcolor: 'success.light', p: 1 }}>
            <CardContent sx={{ p: '8px !important' }}>
              <Typography variant="caption" sx={{ color: 'success.dark', fontWeight: 600 }}>
                🚀 AI Optimization Active
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'success.dark' }}>
                +{Math.floor(Math.random() * 15) + 20}% Throughput
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}

Railway3DVisualization.propTypes = {
  scenario: PropTypes.oneOf(['normal', 'congestion', 'emergency', 'optimized']).isRequired,
  aiMode: PropTypes.bool.isRequired,
  trafficData: PropTypes.object,
  demoRunning: PropTypes.bool
};

Railway3DVisualization.defaultProps = {
  trafficData: null,
  demoRunning: false
};
