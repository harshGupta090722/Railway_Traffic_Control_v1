// src/components/dashboard/PerformanceMetrics.js
'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Typography, Box, Grid, LinearProgress, Alert
} from '@mui/material';
import {
  TrendingUp, Speed, Schedule, Warning, Assessment,
  CheckCircle, Psychology
} from '@mui/icons-material';

export default function PerformanceMetrics({ data, scenario, aiMode }) {
  const [metrics, setMetrics] = useState({
    throughput: 85,
    averageDelay: 3.2,
    efficiency: 92,
    conflicts: 2
  });

  // Simulate realistic performance metrics based on scenario and AI mode
  useEffect(() => {
    const generateMetrics = () => {
      let baseMetrics = {
        throughput: 85,
        averageDelay: 3.2,
        efficiency: 92,
        conflicts: 2
      };

      // Modify metrics based on scenario
      switch (scenario) {
        case 'congestion':
          baseMetrics = {
            throughput: aiMode ? 78 : 65,
            averageDelay: aiMode ? 5.8 : 8.9,
            efficiency: aiMode ? 85 : 72,
            conflicts: aiMode ? 1 : 4
          };
          break;
        case 'emergency':
          baseMetrics = {
            throughput: 45, // Reduced during emergency
            averageDelay: 12.3,
            efficiency: 60,
            conflicts: 0 // Well managed during emergency
          };
          break;
        case 'optimized':
          if (aiMode) {
            baseMetrics = {
              throughput: 96,
              averageDelay: 1.8,
              efficiency: 98,
              conflicts: 0
            };
          }
          break;
        default: // normal
          baseMetrics = {
            throughput: aiMode ? 88 : 85,
            averageDelay: aiMode ? 2.5 : 3.2,
            efficiency: aiMode ? 94 : 92,
            conflicts: aiMode ? 1 : 2
          };
      }

      return baseMetrics;
    };

    setMetrics(generateMetrics());
  }, [scenario, aiMode]);

  const MetricCard = ({ title, value, unit, icon: Icon, color, progress, trend }) => (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Icon sx={{ color: `${color}.main`, mr: 1 }} />
        <Typography variant="subtitle2" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {trend && (
          <Typography variant="caption" color={trend > 0 ? 'success.main' : 'error.main'}>
            {trend > 0 ? '+' : ''}{trend}%
          </Typography>
        )}
      </Box>
      
      <Typography variant="h4" color={`${color}.main`} gutterBottom>
        {typeof value === 'number' ? value.toFixed(1) : value}{unit}
      </Typography>
      
      {progress !== undefined && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            color={color}
            sx={{ height: 8, borderRadius: 5 }}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {progress}% of target
          </Typography>
        </Box>
      )}
    </Paper>
  );

  return (
    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Assessment sx={{ mr: 1 }} />
        Performance Metrics
      </Typography>

      {/* Key Performance Indicators */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <MetricCard
            title="Throughput"
            value={metrics.throughput}
            unit="%"
            icon={Speed}
            color="primary"
            progress={metrics.throughput}
            trend={aiMode ? (metrics.throughput - 85) : 0}
          />
        </Grid>
        <Grid item xs={6}>
          <MetricCard
            title="Avg Delay"
            value={metrics.averageDelay}
            unit=" min"
            icon={Schedule}
            color="warning"
          />
        </Grid>
        <Grid item xs={6}>
          <MetricCard
            title="Efficiency"
            value={metrics.efficiency}
            unit="%"
            icon={TrendingUp}
            color="success"
            progress={metrics.efficiency}
            trend={aiMode ? (metrics.efficiency - 92) : 0}
          />
        </Grid>
        <Grid item xs={6}>
          <MetricCard
            title="Conflicts"
            value={metrics.conflicts}
            unit=""
            icon={Warning}
            color={metrics.conflicts === 0 ? "success" : "error"}
          />
        </Grid>
      </Grid>

      {/* AI Performance Indicator */}
      {aiMode && scenario === 'optimized' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Psychology sx={{ mr: 1 }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                AI Optimization Active
              </Typography>
              <Typography variant="caption">
                {((metrics.throughput - 85) / 85 * 100).toFixed(1)}% improvement over baseline
              </Typography>
            </Box>
          </Box>
        </Alert>
      )}

      {/* Scenario Status */}
      <Box sx={{ 
        p: 2, 
        bgcolor: scenario === 'emergency' ? 'error.light' : 
                scenario === 'congestion' ? 'warning.light' : 
                scenario === 'optimized' ? 'success.light' : 'info.light',
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center'
      }}>
        <CheckCircle sx={{ mr: 1, color: 'white' }} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
            Current Status: {scenario.charAt(0).toUpperCase() + scenario.slice(1)} Operations
          </Typography>
          <Typography variant="caption" sx={{ color: 'white', opacity: 0.9 }}>
            {scenario === 'emergency' && 'Emergency protocols active'}
            {scenario === 'congestion' && 'High traffic volume detected'}
            {scenario === 'optimized' && aiMode && 'AI optimization providing maximum efficiency'}
            {scenario === 'normal' && 'All systems operating within normal parameters'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

PerformanceMetrics.propTypes = {
  data: PropTypes.object,
  scenario: PropTypes.string.isRequired,
  aiMode: PropTypes.bool.isRequired
};

PerformanceMetrics.defaultProps = {
  data: null
};
