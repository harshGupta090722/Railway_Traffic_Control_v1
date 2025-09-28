// src/app/page.js
'use client';
import { useState, useEffect } from 'react';
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

// Import components
import TrafficControlCenter from '@/components/dashboard/TrafficControlCenter';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import PerformanceMetrics from '@/components/dashboard/PerformanceMetrics';
import Railway3DVisualization from '@/components/3d/Railway3DVisualization';
import ConflictManager from '@/components/dashboard/ConflictManager';
import SystemStatus from '@/components/dashboard/SystemStatus';

export default function Home() {
  // Simplified state management
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [aiMode, setAiMode] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [demoRunning, setDemoRunning] = useState(false);
  
  // Mock data to prevent loading issues
  const trafficData = {
    trains: [
      { id: 'EXP001', name: 'Rajdhani Express', type: 'EXPRESS', speed: 85, status: 'RUNNING' },
      { id: 'LOC002', name: 'Local Passenger', type: 'LOCAL', speed: 60, status: 'RUNNING' },
      { id: 'FRG003', name: 'Freight Express', type: 'FREIGHT', speed: 45, status: 'DELAYED' },
      { id: 'EXP004', name: 'Shatabdi Express', type: 'EXPRESS', speed: 90, status: 'RUNNING' }
    ]
  };

  const connectionStatus = 'Connected';

  // Demo scenarios
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

  // Simplified handlers
  const handleScenarioChange = (scenario) => {
    setSelectedScenario(scenario);
    
    // Show transition alert
    setAlerts(prev => [...prev.slice(-3), {
      type: 'SCENARIO_CHANGE',
      message: `Switched to ${scenarios[scenario].name}`,
      level: 'info',
      timestamp: new Date().toISOString(),
      id: Date.now()
    }]);
  };

  const toggleAIMode = () => {
    const newAiMode = !aiMode;
    setAiMode(newAiMode);
    
    setAlerts(prev => [...prev.slice(-3), {
      type: 'AI_MODE_CHANGE',
      message: newAiMode ? 'AI Optimization ACTIVATED' : 'AI Optimization DEACTIVATED',
      level: newAiMode ? 'success' : 'info',
      timestamp: new Date().toISOString(),
      id: Date.now()
    }]);
  };

  const startDemoSequence = () => {
    if (demoRunning) return;
    
    setDemoRunning(true);
    
    // Simple demo sequence
    const demoSteps = [
      { scenario: 'normal', duration: 3000 },
      { scenario: 'congestion', duration: 4000 },
      { scenario: 'optimized', aiMode: true, duration: 4000 }
    ];
    
    let currentStep = 0;
    const executeStep = () => {
      if (currentStep < demoSteps.length) {
        const step = demoSteps[currentStep];
        setSelectedScenario(step.scenario);
        if (step.aiMode) setAiMode(true);
        
        currentStep++;
        setTimeout(executeStep, step.duration);
      } else {
        setDemoRunning(false);
      }
    };
    
    executeStep();
  };

  const sendMessage = (message) => {
    console.log('Message sent:', message);
    // Mock response
    setTimeout(() => {
      setAlerts(prev => [...prev.slice(-3), {
        type: 'ACTION_RESPONSE',
        message: `Action completed: ${message.type}`,
        level: 'success',
        timestamp: new Date().toISOString(),
        id: Date.now()
      }]);
    }, 1000);
  };

  // Navigation items
  const navigationItems = [
    { text: 'Dashboard', icon: DashboardIcon, active: true },
    { text: 'Live Traffic', icon: Traffic },
    { text: 'AI Insights', icon: Psychology },
    { text: 'Analytics', icon: Assessment },
    { text: 'Training', icon: ModelTraining },
    { text: 'Settings', icon: Settings }
  ];

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
            <Train sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              AI-Powered Railway Traffic Control System
            </Typography>
            
            {/* Connection Status */}
            <Chip
              label={`Status: ${connectionStatus}`}
              color="success"
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
          {alerts.slice(-2).map((alert) => (
            <Alert
              key={alert.id}
              severity={alert.level || 'info'}
              sx={{ mb: 2 }}
              onClose={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
            >
              {alert.message}
            </Alert>
          ))}

          {/* Main Dashboard Grid */}
          <Grid container spacing={3}>
            {/* 3D Railway Visualization */}
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
              </Paper>
            </Grid>

            {/* AI Recommendations Panel */}
            <Grid item xs={12} lg={4}>
              <AIRecommendations 
                scenario={selectedScenario}
                aiMode={aiMode}
                onActionTaken={sendMessage}
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
