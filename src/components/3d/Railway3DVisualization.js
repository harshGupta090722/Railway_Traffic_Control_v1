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
  Timeline, Psychology, ReportProblem
} from '@mui/icons-material';

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
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  
  // Generate realistic train movements based on scenario
  const generateScenarioTrains = useCallback(() => {
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

    // Modify based on scenario
    return baseTrains.map(train => {
      let modifiedTrain = { ...train };
      
      switch (scenario) {
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
          if (aiMode) {
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
  }, [scenario, aiMode]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Update trains data and performance metrics
  useEffect(() => {
    const newTrains = generateScenarioTrains();
    setTrains(newTrains);
    
    // Update performance metrics
    setPerformanceMetrics({
      throughput: calculateThroughput(newTrains),
      efficiency: calculateEfficiency(scenario, aiMode),
      conflicts: newTrains.filter(t => t.conflicted).length,
      optimizedTrains: newTrains.filter(t => t.optimized).length
    });
  }, [scenario, aiMode, generateScenarioTrains]);

  // Animation loop for demo
  useEffect(() => {
    if (!demoRunning) return;

    const animationInterval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          position: {
            ...train.position,
            x: train.position.x + (train.speed * 0.1 * animationSpeed) / 10
          }
        }))
      );
    }, 100);

    return () => clearInterval(animationInterval);
  }, [demoRunning, animationSpeed]);

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

      {/* Fallback 3D Simulation */}
      {!loading && (
        <Box sx={{
          width: '100%',
          height: '100%',
          background: scenario === 'emergency' 
            ? 'linear-gradient(135deg, #d32f2f 0%, #f57c00 100%)'
            : scenario === 'congestion'
            ? 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)'
            : scenario === 'optimized' && aiMode
            ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
            : 'linear-gradient(135deg, #1976d2 0%, #64b5f6 100%)',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden'
        }}>
          {/* Railway Track SVG Animation */}
          <svg
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {/* Main track lines */}
            <line x1="10%" y1="45%" x2="90%" y2="45%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
            <line x1="10%" y1="55%" x2="90%" y2="55%" stroke="rgba(255,255,255,0.8)" strokeWidth="6" />
            
            {/* Parallel tracks */}
            <line x1="10%" y1="35%" x2="90%" y2="35%" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
            <line x1="10%" y1="65%" x2="90%" y2="65%" stroke="rgba(255,255,255,0.6)" strokeWidth="4" />
            
            {/* Track switches */}
            <path d="M 30% 45% L 40% 35%" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />
            <path d="M 60% 55% L 70% 65%" stroke="rgba(255,255,255,0.8)" strokeWidth="4" />
            
            {/* Railway sleepers */}
            {[...Array(20)].map((_, i) => (
              <rect
                key={i}
                x={`${15 + i * 3.5}%`}
                y="40%"
                width="2%"
                height="20%"
                fill="rgba(255,255,255,0.4)"
                rx="1"
              />
            ))}
            
            {/* Animated trains */}
            {trains.map((train, index) => {
              const xPosition = `${Math.max(5, Math.min(85, 20 + (index * 20) + (demoRunning ? Math.sin(Date.now() / 1000 + index) * 5 : 0)))}%`;
              const yPosition = index % 2 === 0 ? '42%' : index === 1 ? '32%' : '62%';
              
              return (
                <g key={train.id}>
                  {/* Train body */}
                  <rect
                    x={xPosition}
                    y={yPosition}
                    width="8%"
                    height="12%"
                    fill={train.color}
                    rx="3"
                    style={{
                      filter: train.optimized ? 'drop-shadow(0 0 8px #4caf50)' : 
                             train.conflicted ? 'drop-shadow(0 0 8px #f44336)' :
                             train.emergency ? 'drop-shadow(0 0 12px #ff0000)' : 'none',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedTrain(selectedTrain === train.id ? null : train.id)}
                  />
                  
                  {/* Train windows */}
                  <rect
                    x={`calc(${xPosition} + 1%)`}
                    y={`calc(${yPosition} + 2%)`}
                    width="6%"
                    height="8%"
                    fill="rgba(135, 206, 235, 0.7)"
                    rx="1"
                  />
                  
                  {/* Train label */}
                  <text
                    x={`calc(${xPosition} + 4%)`}
                    y={`calc(${yPosition} + 7%)`}
                    fill="white"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{ userSelect: 'none' }}
                  >
                    {train.type.substring(0, 3)}
                  </text>
                  
                  {/* Speed indicator */}
                  <text
                    x={`calc(${xPosition} + 4%)`}
                    y={`calc(${yPosition} + 16%)`}
                    fill="white"
                    fontSize="8"
                    textAnchor="middle"
                    style={{ userSelect: 'none' }}
                  >
                    {Math.round(train.speed)} km/h
                  </text>
                  
                  {/* Status indicators */}
                  {train.optimized && (
                    <circle
                      cx={`calc(${xPosition} + 9%)`}
                      cy={`calc(${yPosition} + 2%)`}
                      r="3"
                      fill="#4caf50"
                    />
                  )}
                  {train.conflicted && (
                    <circle
                      cx={`calc(${xPosition} + 9%)`}
                      cy={`calc(${yPosition} + 2%)`}
                      r="3"
                      fill="#f44336"
                    />
                  )}
                  {train.emergency && (
                    <circle
                      cx={`calc(${xPosition} + 9%)`}
                      cy={`calc(${yPosition} + 2%)`}
                      r="4"
                      fill="#ff0000"
                      style={{ animation: 'pulse 1s infinite' }}
                    />
                  )}
                </g>
              );
            })}
            
            {/* Signal lights */}
            <circle cx="25%" cy="30%" r="4" fill={scenario === 'emergency' ? '#ff0000' : scenario === 'congestion' ? '#ffaa00' : '#00ff00'} />
            <circle cx="50%" cy="70%" r="4" fill={scenario === 'emergency' ? '#ff0000' : scenario === 'congestion' ? '#ffaa00' : '#00ff00'} />
            <circle cx="75%" cy="30%" r="4" fill={scenario === 'emergency' ? '#ff0000' : scenario === 'congestion' ? '#ffaa00' : '#00ff00'} />
          </svg>

          {/* Scenario-based overlay effects */}
          {scenario === 'emergency' && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0.3) 100%)',
              animation: 'pulse 2s infinite'
            }} />
          )}
          
          {aiMode && scenario === 'optimized' && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, rgba(76,175,80,0.2) 100%)',
              animation: 'pulse 3s infinite'
            }} />
          )}
        </Box>
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
              Live Railway Network
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
                  {train.emergency && <ReportProblem sx={{ color: 'error.main', fontSize: 16 }} />}
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
          onClick={() => setViewMode('overview')}
        />
        <SpeedDialAction
          icon={<MyLocation />}
          tooltipTitle="Track Level View"
          onClick={() => setViewMode('track')}
        />
        <SpeedDialAction
          icon={<CenterFocusStrong />}
          tooltipTitle="Junction View"
          onClick={() => setViewMode('junction')}
        />
        <SpeedDialAction
          icon={<TrainIcon />}
          tooltipTitle="Station View"
          onClick={() => setViewMode('station')}
        />
      </SpeedDial>

      {/* Animation Controls */}
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
          
          <Tooltip title="Reset View">
            <Fab
              size="small"
              onClick={() => setViewMode('overview')}
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

      {/* CSS for animations */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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
