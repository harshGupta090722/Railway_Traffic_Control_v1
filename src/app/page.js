// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Container, Grid, Paper, Typography, Box, Card, CardContent,
  AppBar, Toolbar, Chip, Button, Alert, Fab, IconButton,
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import {
  Train, Traffic, Speed, Warning, CheckCircle, Timeline,
  Psychology, Settings, Menu, Dashboard as DashboardIcon, Assessment,
  ModelTraining, NotificationsActive
} from '@mui/icons-material';

// Import your actual components from Step 4
import TrafficControlCenter from '@/components/dashboard/TrafficControlCenter';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import Railway3DVisualization from '@/components/3d/Railway3DVisualization';
import ConflictManager from '@/components/dashboard/ConflictManager';
import SystemStatus from '@/components/dashboard/SystemStatus';

// Import custom hooks from Step 4
import { useTrafficData } from '@/hooks/useTrafficData';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function Home() {
  // State management for dashboard
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [aiMode, setAiMode] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [demoRunning, setDemoRunning] = useState(false);
  
  // Custom hooks for data management (from Step 4)
  const { trafficData, loading, error } = useTrafficData();
  const { socketData, sendMessage, connectionStatus } = useWebSocket('ws://localhost:8000');

  // Demo scenarios for impressive presentation
  const scenarios = {
    normal: { 
      name: 'Normal Operations', 
      color: 'success',
      description: 'Standard railway traffic flow'
    },
    congestion: { 
      name: 'Rush Hour Congestion', 
      color: 'warning',
      description: 'High traffic with optimization opportunities'
    },
    emergency: { 
      name: 'Emergency Priority', 
      color: 'error',
      description: 'Emergency vehicle routing scenario'
    },
    optimized: { 
      name: 'AI Optimized', 
      color: 'info',
      description: 'AI-powered traffic optimization active'
    }
  };

  // Effect for handling real-time socket updates
  useEffect(() => {
    if (socketData) {
      setAlerts(prev => [...prev.slice(-4), socketData]);
      
      // Auto-enable AI mode for optimized scenario
      if (socketData.type === 'SCENARIO_CHANGE' && socketData.scenario === 'optimized') {
        setAiMode(true);
      }
    }
  }, [socketData]);

  // Handlers for interactive controls
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    sendMessage({ 
      type: 'SCENARIO_CHANGE', 
      scenario,
      timestamp: new Date().toISOString()
    });
    
    // Show impressive demo transition alert
    setAlerts(prev => [...prev, {
      type: 'SCENARIO_CHANGE',
      message: `Switching to ${scenarios[scenario].name} - Analyzing traffic patterns...`,
      level: 'info',
      timestamp: new Date().toISOString()
    }]);
  };

  const toggleAIMode = () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    sendMessage({ 
      type: 'AI_MODE_TOGGLE', 
      enabled: newAiMode,
      timestamp: new Date().toISOString()
    });
    
    setAlerts(prev => [...prev, {
      type: 'AI_MODE_CHANGE',
      message: newAiMode ? 'AI Optimization ACTIVATED - Real-time analysis started' : 'AI Optimization DEACTIVATED',
      level: newAiMode ? 'success' : 'info',
      timestamp: new Date().toISOString()
    }]);
  };

  const startDemoSequence = () => {
    setDemoRunning(true);
    
    // Automated demo sequence for presentation
    const demoSteps = [
      { scenario: 'normal', duration: 3000 },
      { scenario: 'congestion', duration: 5000 },
      { scenario: 'optimized', aiMode: true, duration: 5000 }
    ];
    
    demoSteps.forEach((step, index) => {
      setTimeout(() => {
        setSelectedScenario(step.scenario);
        if (step.aiMode) setAiMode(true);
        
        if (index === demoSteps.length - 1) {
          setTimeout(() => setDemoRunning(false), step.duration);
        }
      }, index * (demoSteps[index - 1]?.duration || 0));
    });
  };

  // Sidebar navigation items
  const navigationItems = [
    { text: 'Dashboard', icon: DashboardIcon, active: true },
    { text: 'Live Traffic', icon: Traffic },
    { text: 'AI Insights', icon: Psychology },
    { text: 'Analytics', icon: Assessment },
    { text: 'Training', icon: ModelTraining },
    { text: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)'
      }}>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Train sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6">Loading Railway Control System...</Typography>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      {/* Sidebar Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            bgcolor: '#1e293b',
            color: 'white'
          },
        }}
      >
        <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #334155' }}>
          <Train sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            SIH 2025
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Railway Control
          </Typography>
        </Box>
        
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.text}
              sx={{ 
                bgcolor: item.active ? 'rgba(25, 118, 210, 0.2)' : 'transparent',
                borderRight: item.active ? '3px solid #1976d2' : 'none'
              }}
            >
              <ListItemIcon sx={{ color: item.active ? 'primary.main' : 'inherit' }}>
                <item.icon />
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Top Navigation Bar */}
        <AppBar position="static" sx={{ bgcolor: '#1976d2', mb: 3 }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(true)}>
              <Menu />
            </IconButton>
            
            <Train sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI-Powered Railway Traffic Control System
            </Typography>
            
            {/* Connection Status */}
            <Chip
              label={`Status: ${connectionStatus}`}
              color={connectionStatus === 'Connected' ? 'success' : 'warning'}
              sx={{ mr: 2, color: 'white' }}
            />
            
            {/* Current Scenario */}
            <Chip
              label={scenarios[selectedScenario].name}
              color={scenarios[selectedScenario].color}
              sx={{ mr: 2 }}
            />
            
            {/* AI Mode Toggle */}
            <Button
              variant="contained"
              color={aiMode ? 'success' : 'inherit'}
              onClick={toggleAIMode}
              startIcon={aiMode ? <CheckCircle /> : <Speed />}
              sx={{ mr: 2 }}
            >
              {aiMode ? 'AI Active' : 'Manual Mode'}
            </Button>
            
            {/* Demo Control */}
            <Button
              variant="outlined"
              color="inherit"
              onClick={startDemoSequence}
              disabled={demoRunning}
              startIcon={<Timeline />}
            >
              {demoRunning ? 'Demo Running...' : 'Start Demo'}
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl">
          {/* Alert System */}
          {alerts.slice(-2).map((alert, index) => (
            <Alert
              key={index}
              severity={alert.level || 'info'}
              sx={{ mb: 2 }}
              onClose={() => setAlerts(prev => prev.filter((_, i) => i !== index))}
            >
              {alert.message}
            </Alert>
          ))}

          {/* Main Dashboard Grid */}
          <Grid container spacing={3}>
            {/* 3D Railway Visualization - Takes prominent space */}
            <Grid item xs={12} lg={8}>
              <Paper elevation={3} sx={{ p: 2, height: 600, position: 'relative' }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Traffic sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Live Railway Network
                </Typography>
                <Railway3DVisualization 
                  scenario={selectedScenario}
                  aiMode={aiMode}
                  trafficData={trafficData}
                  demoRunning={demoRunning}
                />
                
                {/* 3D Controls Overlay */}
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 16, 
                  right: 16,
                  display: 'flex',
                  gap: 1
                }}>
                  <Fab size="small" color="primary">
                    <Speed />
                  </Fab>
                  <Fab size="small" color="secondary">
                    <Settings />
                  </Fab>
                </Box>
              </Paper>
            </Grid>

            {/* AI Recommendations Panel */}
            <Grid item xs={12} lg={4}>
              <AIRecommendations 
                scenario={selectedScenario}
                aiMode={aiMode}
                onActionTaken={(action) => sendMessage(action)}
                demoRunning={demoRunning}
              />
            </Grid>

            {/* Performance Metrics */}
            <Grid item xs={12} md={6}>
              <PerformanceMetrics 
                data={trafficData}
                scenario={selectedScenario}
                aiMode={aiMode}
              />
            </Grid>

            {/* Traffic Control Center */}
            <Grid item xs={12} md={6}>
              <TrafficControlCenter 
                onScenarioChange={handleScenarioChange}
                currentScenario={selectedScenario}
                scenarios={scenarios}
                demoRunning={demoRunning}
              />
            </Grid>

            {/* System Status */}
            <Grid item xs={12} md={6}>
              <SystemStatus 
                trafficData={trafficData}
                connectionStatus={connectionStatus}
                aiMode={aiMode}
              />
            </Grid>

            {/* Conflict Management */}
            <Grid item xs={12} md={6}>
              <ConflictManager 
                trafficData={trafficData}
                aiMode={aiMode}
                scenario={selectedScenario}
              />
            </Grid>
          </Grid>
        </Container>

        {/* Floating Action Button for Quick Demo */}
        <Fab
          color="secondary"
          sx={{ 
            position: 'fixed', 
            bottom: 24, 
            right: 24,
            '&:hover': { transform: 'scale(1.1)' }
          }}
          onClick={startDemoSequence}
          disabled={demoRunning}
        >
          <NotificationsActive />
        </Fab>
      </Box>
    </Box>
  );
}
