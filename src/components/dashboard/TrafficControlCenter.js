// src/components/dashboard/TrafficControlCenter.js
'use client';
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Typography, Button, Grid, Box, FormControl, InputLabel, 
  Select, MenuItem, Chip, Alert, Divider, Card, CardContent
} from '@mui/material';
import {
  PlayArrow, Stop, Pause, SkipNext, Settings, Traffic,
  Speed, Timeline, Psychology
} from '@mui/icons-material';

export default function TrafficControlCenter({ 
  onScenarioChange, 
  currentScenario, 
  scenarios, 
  demoRunning 
}) {
  const [autoMode, setAutoMode] = useState(false);
  const [controlStatus, setControlStatus] = useState('Manual Control Active');

  const handleScenarioChange = (scenario) => {
    onScenarioChange(scenario);
    setControlStatus(`Switched to ${scenarios[scenario].name}`);
  };

  const handleAutoDemo = () => {
    setAutoMode(true);
    setControlStatus('Automated Demo Sequence Started');
    
    const demoSequence = ['normal', 'congestion', 'optimized'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < demoSequence.length) {
        handleScenarioChange(demoSequence[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setAutoMode(false);
        setControlStatus('Demo Sequence Completed');
      }
    }, 5000);
  };

  return (
    <Paper elevation={3} sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Settings sx={{ mr: 1 }} />
          Traffic Control Center
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          Master control for railway operations
        </Typography>
      </Box>

      {/* Control Panel */}
      <Box sx={{ p: 2, flexGrow: 1 }}>
        {/* Scenario Selection */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Operation Scenarios
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Demo Scenario</InputLabel>
            <Select
              value={currentScenario}
              label="Select Demo Scenario"
              onChange={(e) => handleScenarioChange(e.target.value)}
              disabled={autoMode || demoRunning}
            >
              {Object.entries(scenarios).map(([key, scenario]) => (
                <MenuItem key={key} value={key}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Typography sx={{ flexGrow: 1 }}>{scenario.name}</Typography>
                    <Chip 
                      label={scenario.color} 
                      size="small" 
                      color={scenario.color}
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Demo Controls */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Demo Controls
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                color="success"
                size="small"
                fullWidth
                onClick={handleAutoDemo}
                disabled={autoMode || demoRunning}
              >
                Auto Demo
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<Pause />}
                size="small"
                fullWidth
                disabled={!autoMode && !demoRunning}
              >
                Pause
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<SkipNext />}
                size="small"
                fullWidth
              >
                Next Scene
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                variant="outlined"
                startIcon={<Stop />}
                color="error"
                size="small"
                fullWidth
              >
                Emergency Stop
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* Current Status */}
        <Alert 
          severity={autoMode || demoRunning ? 'info' : 'success'} 
          sx={{ mb: 2 }}
          icon={autoMode || demoRunning ? <Timeline /> : <Traffic />}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            Status: {controlStatus}
          </Typography>
        </Alert>

        {/* Quick Actions */}
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Speed />} 
              label="Optimize Speed" 
              clickable 
              color="primary" 
              size="small"
            />
            <Chip 
              icon={<Psychology />} 
              label="AI Analysis" 
              clickable 
              color="secondary" 
              size="small"
            />
            <Chip 
              icon={<Traffic />} 
              label="Route Analysis" 
              clickable 
              color="info" 
              size="small"
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 1.5, bgcolor: 'grey.50', textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Current Scenario: {scenarios[currentScenario].name} • 
          {autoMode ? ' Auto Mode Active' : ' Manual Control'}
        </Typography>
      </Box>
    </Paper>
  );
}

TrafficControlCenter.propTypes = {
  onScenarioChange: PropTypes.func.isRequired,
  currentScenario: PropTypes.string.isRequired,
  scenarios: PropTypes.object.isRequired,
  demoRunning: PropTypes.bool
};

TrafficControlCenter.defaultProps = {
  demoRunning: false
};
