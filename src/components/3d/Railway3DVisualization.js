// src/components/3d/Railway3DVisualization.js
'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { 
  Box, Typography, CircularProgress, Fab, Chip, Card, 
  CardContent, Alert, Tooltip, SpeedDial, SpeedDialAction,
  Badge, LinearProgress
} from '@mui/material';
import { 
  Speed, Pause, PlayArrow, Refresh, Visibility, 
  Train as TrainIcon, Warning, CheckCircle, Videocam,
  ThreeDRotation, CenterFocusStrong, MyLocation,
  Timeline, Psychology, Emergency
} from '@mui/icons-material';
import Spline from '@spline-tool/react-spline';
import { useSpline3D } from '@/hooks/useSpline3D';
import SplineSceneManager from './SplineSceneManager';

export default function Railway3DVisualization({ 
  scenario, 
  aiMode, 
  trafficData, 
  demoRunning 
}) {
  // State management
  const [loading, setLoading] = useState(true);
  const [sceneError, setSceneError] = useState(false);
  const [currentCamera, setCurrentCamera] = useState('overview');
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [animationSpeed, setAnimationSpeed] = useState(1.0);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  
  // Refs
  const splineRef = useRef(null);
  const sceneManagerRef = useRef(null);
  
  // Custom hook for 3D logic
  const {
    trains,
    updateTrainPositions,
    generateScenarioData,
    handleScenarioChange
  } = useSpline3D(scenario, aiMode);

  // Spline scene URL - Replace with your actual scene
  const splineSceneUrl = process.env.NEXT_PUBLIC_SPLINE_SCENE_URL || 
    'https://prod.spline.design/6Wq8RjlyM3dBn2pf/scene.splinecode';

  // Handle Spline scene loading
  const onSplineLoad = useCallback((splineApp) => {
    console.log('🎬 Spline scene loaded successfully');
    setLoading(false);
    splineRef.current = splineApp;
    
    // Initialize scene manager
    sceneManagerRef.current = new SplineSceneManager(splineApp);
    
    // Set up initial scene
    const initialData = generateScenarioData(scenario, aiMode);
    sceneManagerRef.current.updateScene(initialData);
    
    // Set up interaction handlers
    setupSceneInteractions(splineApp);
    
  }, [scenario, aiMode, generateScenarioData]);

  // Set up scene interactions
  const setupSceneInteractions = useCallback((splineApp) => {
    // Handle train clicks
    window.addEventListener('message', (event) => {
      if (event.data.type === 'TRAIN_SELECTED') {
        setSelectedTrain(event.data.trainId);
        
        // Focus camera on selected train
        const trainObject = splineApp.findObjectByName(`train-${event.data.trainId}`);
        if (trainObject && sceneManagerRef.current) {
          sceneManagerRef.current.focusOnTrain(trainObject);
        }
      }
    });

    // Handle scenario updates from parent
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SCENARIO_UPDATE') {
        handleScenarioChange(event.data.scenario, event.data.aiMode);
      }
    });
  }, [handleScenarioChange]);

  // Update scene when scenario/AI mode changes
  useEffect(() => {
    if (sceneManagerRef.current) {
      const sceneData = generateScenarioData(scenario, aiMode);
      sceneManagerRef.current.updateScene(sceneData);
      
      // Update performance metrics
      setPerformanceMetrics({
        throughput: calculateThroughput(sceneData.trains),
        efficiency: calculateEfficiency(scenario, aiMode),
        conflicts: sceneData.conflicts?.length || 0,
        optimizedTrains: sceneData.trains.filter(t => t.optimized).length
      });
    }
  }, [scenario, aiMode, generateScenarioData]);

  // Animation loop for demo mode
  useEffect(() => {
    if (!demoRunning || !sceneManagerRef.current) return;

    const animationInterval = setInterval(() => {
      updateTrainPositions(animationSpeed);
      
      if (sceneManagerRef.current) {
        const updatedData = generateScenarioData(scenario, aiMode);
        sceneManagerRef.current.animateTrains(updatedData.trains, animationSpeed);
      }
    }, 100);

    return () => clearInterval(animationInterval);
  }, [demoRunning, animationSpeed, scenario, aiMode, updateTrainPositions, generateScenarioData]);

  // Camera control functions
  const changeCameraView = useCallback((viewType) => {
    if (!sceneManagerRef.current) return;
    
    sceneManagerRef.current.setCameraView(viewType);
    setCurrentCamera(viewType);
  }, []);

  // Error handling
  const onSplineError = useCallback((error) => {
    console.error('Spline scene loading error:', error);
    setSceneError(true);
    setLoading(false);
  }, []);

  // Performance calculations
  const calculateThroughput = (trainsList) => {
    const runningTrains = trainsList.filter(t => t.status === 'RUNNING' || t.status === 'OPTIMIZED');
    return Math.min((runningTrains.length / 4) * 100, 100);
  };

  const calculateEfficiency = (currentScenario, aiActive) => {
    const baseEfficiency = {
      normal: 85,
      congestion: 65,
      emergency: 40,
      optimized: aiActive ? 95 : 75
    };
    return baseEfficiency[currentScenario] || 85;
  };

  // Get scenario color
  const getScenarioColor = (currentScenario) => {
    const colors = {
      normal: 'success',
      congestion: 'warning', 
      emergency: 'error',
      optimized: 'info'
    };
    return colors[currentScenario] || 'default';
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      height: '100%', 
      bgcolor: '#f0f2f5', 
      borderRadius: 2, 
      overflow: 'hidden',
      boxShadow: 3
    }}>
      {/* Loading State */}
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          p: 4,
          borderRadius: 3,
          boxShadow: 4,
          minWidth: 300
        }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
            Loading Railway Network
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Initializing 3D visualization engine...
          </Typography>
          <LinearProgress sx={{ mt: 2, width: '100%' }} />
        </Box>
      )}

      {/* Error Fallback */}
      {sceneError && (
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          textAlign: 'center'
        }}>
          <Alert severity="warning" sx={{ mb: 2, minWidth: 300 }}>
            <Typography variant="h6">3D Scene Unavailable</Typography>
            <Typography variant="body2">
              Spline scene could not be loaded. Using fallback mode.
            </Typography>
          </Alert>
          
          {/* Fallback 2D visualization */}
          <Card sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="subtitle1" gutterBottom>
              Railway Network Simulation
            </Typography>
            <Box sx={{ 
              width: '100%', 
              height: 300, 
              bgcolor: 'primary.light', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column'
            }}>
              <TrainIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" color="primary.main">
                Simulation Active
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Scenario: {scenario} | AI: {aiMode ? 'Enabled' : 'Disabled'}
              </Typography>
            </Box>
          </Card>
        </Box>
      )}

      {/* Spline 3D Scene */}
      {!sceneError && (
        <Spline
          scene={splineSceneUrl}
          onLoad={onSplineLoad}
          onError={onSplineError}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8px'
          }}
        />
      )}

      {/* Live Status Panel */}
      <Card sx={{
        position: 'absolute',
        top: 20,
        left: 20,
        minWidth: 320,
        maxWidth: 380,
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        boxShadow: 4
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              <Badge badgeContent={trains.length} color="primary">
                <TrainIcon sx={{ mr: 1, color: 'primary.main' }} />
              </Badge>
              Live Network Status
            </Typography>
            
            {demoRunning && (
              <Chip 
                label="Demo Running" 
                color="success" 
                size="small"
                icon={<PlayArrow />}
                sx={{ animation: 'pulse 2s infinite' }}
              />
            )}
          </Box>
          
          {/* Status Chips */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={`${trains.length} Active`}
              size="small"
              color="primary"
              icon={<TrainIcon />}
            />
            <Chip
              label={scenario.charAt(0).toUpperCase() + scenario.slice(1)}
              size="small"
              color={getScenarioColor(scenario)}
            />
            <Chip
              label={aiMode ? 'AI Active' : 'Manual'}
              size="small"
              color={aiMode ? 'success' : 'default'}
              icon={aiMode ? <Psychology /> : <Timeline />}
            />
          </Box>
          
          {/* Performance Metrics */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Performance Metrics:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="h6" color="primary.dark">
                  {performanceMetrics.throughput || 0}%
                </Typography>
                <Typography variant="caption">Throughput</Typography>
              </Box>
              <Box sx={{ textAlign: 'center', p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                <Typography variant="h6" color="success.dark">
                  {performanceMetrics.efficiency || 0}%
                </Typography>
                <Typography variant="caption">Efficiency</Typography>
              </Box>
            </Box>
          </Box>

          {/* Alert Messages */}
          {performanceMetrics.conflicts > 0 && (
            <Alert severity="warning" sx={{ mb: 1 }}>
              ⚠️ {performanceMetrics.conflicts} Active Conflicts
            </Alert>
          )}
          
          {performanceMetrics.optimizedTrains > 0 && (
            <Alert severity="success" sx={{ mb: 1 }}>
              ✨ {performanceMetrics.optimizedTrains} Trains AI-Optimized
            </Alert>
          )}

          {scenario === 'emergency' && (
            <Alert severity="error" sx={{ mb: 1 }}>
              🚨 Emergency Protocol Active
            </Alert>
          )}

          {/* Train Status List */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
              Active Trains ({trains.length}):
            </Typography>
            {trains.slice(0, 4).map(train => (
              <Box 
                key={train.id} 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  py: 1,
                  px: 1.5,
                  mb: 0.5,
                  bgcolor: selectedTrain === train.id ? 'primary.light' : 'grey.50',
                  borderRadius: 1,
                  cursor: 'pointer',
                  border: selectedTrain === train.id ? 2 : 1,
                  borderColor: selectedTrain === train.id ? 'primary.main' : 'grey.200',
                  '&:hover': { bgcolor: 'primary.light', opacity: 0.8 }
                }}
                onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {train.id}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {train.name} • {train.type}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {train.emergency && <Emergency sx={{ color: 'error.main', fontSize: 16 }} />}
                  {train.optimized && <Psychology sx={{ color: 'success.main', fontSize: 16 }} />}
                  <Chip
                    label={`${train.speed} km/h`}
                    size="small"
                    color={
                      train.emergency ? 'error' :
                      train.optimized ? 'success' : 
                      train.conflicted ? 'warning' : 'default'
                    }
                    sx={{ fontSize: '0.7rem', minWidth: '70px' }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Camera Controls - Speed Dial */}
      <SpeedDial
        ariaLabel="Camera Controls"
        sx={{ position: 'absolute', bottom: 20, right: 20 }}
        icon={<Videocam />}
        direction="up"
      >
        <SpeedDialAction
          icon={<Visibility />}
          tooltipTitle="Overview Camera"
          onClick={() => changeCameraView('overview')}
        />
        <SpeedDialAction
          icon={<MyLocation />}
          tooltipTitle="Track Level View"
          onClick={() => changeCameraView('track')}
        />
        <SpeedDialAction
          icon={<CenterFocusStrong />}
          tooltipTitle="Junction View"
          onClick={() => changeCameraView('junction')}
        />
        <SpeedDialAction
          icon={<TrainIcon />}
          tooltipTitle="Station View"
          onClick={() => changeCameraView('station')}
        />
      </SpeedDial>

      {/* Animation & View Controls */}
      <Box sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        display: 'flex',
        gap: 1,
        flexDirection: 'column'
      }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={`Animation Speed: ${animationSpeed}x`}>
            <Fab
              size="small"
              color="secondary"
              onClick={() => setAnimationSpeed(animationSpeed >= 2 ? 1 : animationSpeed + 0.5)}
            >
              <Speed />
            </Fab>
          </Tooltip>
          
          <Tooltip title="Reset Camera">
            <Fab
              size="small"
              onClick={() => changeCameraView('overview')}
            >
              <Refresh />
            </Fab>
          </Tooltip>
          
          <Tooltip title="3D Controls">
            <Fab
              size="small"
              color="primary"
            >
              <ThreeDRotation />
            </Fab>
          </Tooltip>
        </Box>

        {/* Speed Indicator */}
        {animationSpeed !== 1 && (
          <Chip
            label={`${animationSpeed}x Speed`}
            size="small"
            color="secondary"
            sx={{ alignSelf: 'flex-start' }}
          />
        )}
      </Box>

      {/* AI Performance Indicator */}
      {aiMode && scenario === 'optimized' && (
        <Card sx={{
          position: 'absolute',
          top: 20,
          right: 20,
          bgcolor: 'success.main',
          color: 'success.contrastText',
          minWidth: 200
        }}>
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Psychology sx={{ mr: 1.5, fontSize: 28 }} />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  AI Optimization Active
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  +{(25 + Math.random() * 15).toFixed(1)}% Throughput
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Real-time traffic optimization
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Emergency Banner */}
      {scenario === 'emergency' && (
        <Alert 
          severity="error" 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 5,
            borderRadius: 0,
            '& .MuiAlert-message': {
              width: '100%',
              textAlign: 'center'
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            🚨 EMERGENCY PROTOCOL ACTIVE 🚨
          </Typography>
          <Typography variant="body2">
            All trains are being safely managed. Emergency corridor is clear.
          </Typography>
        </Alert>
      )}
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
