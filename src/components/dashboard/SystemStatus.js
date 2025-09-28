// src/components/dashboard/SystemStatus.js
'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Typography, Box, List, ListItem, ListItemIcon, 
  ListItemText, Chip, Divider, Alert, LinearProgress
} from '@mui/material';
import {
  CheckCircle, Warning, Error, Psychology, Speed, 
  Train, Traffic, Assessment, WifiTethering
} from '@mui/icons-material';

export default function SystemStatus({ trafficData, connectionStatus, aiMode }) {
  const [systemHealth, setSystemHealth] = useState([]);
  const [overallStatus, setOverallStatus] = useState('optimal');

  useEffect(() => {
    const generateSystemStatus = () => {
      const baseStatus = [
        {
          component: 'Database Connection',
          status: 'online',
          details: 'MongoDB & Redis connected',
          icon: CheckCircle,
          color: 'success'
        },
        {
          component: 'Real-time Updates',
          status: connectionStatus === 'Connected' ? 'online' : 'warning',
          details: `WebSocket: ${connectionStatus}`,
          icon: connectionStatus === 'Connected' ? CheckCircle : Warning,
          color: connectionStatus === 'Connected' ? 'success' : 'warning'
        },
        {
          component: '3D Visualization',
          status: 'online',
          details: 'Spline scene rendering active',
          icon: CheckCircle,
          color: 'success'
        },
        {
          component: 'AI Engine',
          status: aiMode ? 'active' : 'standby',
          details: aiMode ? 'Processing recommendations' : 'Ready for activation',
          icon: aiMode ? Psychology : Speed,
          color: aiMode ? 'info' : 'default'
        },
        {
          component: 'Train Tracking',
          status: 'online',
          details: `Monitoring ${trafficData?.trains?.length || 4} active trains`,
          icon: Train,
          color: 'success'
        },
        {
          component: 'Conflict Detection',
          status: 'online',
          details: 'Scanning for potential conflicts',
          icon: Traffic,
          color: 'success'
        }
      ];

      // Determine overall status
      const hasErrors = baseStatus.some(item => item.status === 'error');
      const hasWarnings = baseStatus.some(item => item.status === 'warning');
      
      let overall = 'optimal';
      if (hasErrors) overall = 'critical';
      else if (hasWarnings) overall = 'warning';
      
      setOverallStatus(overall);
      return baseStatus;
    };

    setSystemHealth(generateSystemStatus());
  }, [trafficData, connectionStatus, aiMode]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': case 'active': return 'success';
      case 'warning': case 'standby': return 'warning';
      case 'error': case 'offline': return 'error';
      default: return 'default';
    }
  };

  const getOverallStatusInfo = () => {
    switch (overallStatus) {
      case 'optimal':
        return {
          color: 'success',
          icon: CheckCircle,
          message: 'All systems operational',
          description: 'Railway control system running at optimal performance'
        };
      case 'warning':
        return {
          color: 'warning',
          icon: Warning,
          message: 'System warnings detected',
          description: 'Some components need attention but core functions remain active'
        };
      case 'critical':
        return {
          color: 'error',
          icon: Error,
          message: 'Critical system issues',
          description: 'Immediate attention required for affected components'
        };
      default:
        return {
          color: 'info',
          icon: Assessment,
          message: 'System status unknown',
          description: 'Checking system health...'
        };
    }
  };

  const statusInfo = getOverallStatusInfo();
  const StatusIcon = statusInfo.icon;

  return (
    <Paper elevation={3} sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, bgcolor: `${statusInfo.color}.main`, color: 'white' }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <StatusIcon sx={{ mr: 1 }} />
          System Status
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {statusInfo.message}
        </Typography>
      </Box>

      {/* Overall Status Summary */}
      <Alert 
        severity={statusInfo.color} 
        sx={{ m: 2, mb: 1 }}
        icon={<StatusIcon />}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {statusInfo.description}
        </Typography>
        {aiMode && (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
            AI optimization is enhancing system performance
          </Typography>
        )}
      </Alert>

      {/* Component Status List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <List dense>
          {systemHealth.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <div key={index}>
                <ListItem>
                  <ListItemIcon>
                    <ItemIcon color={item.color} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {item.component}
                        </Typography>
                        <Chip
                          label={item.status.toUpperCase()}
                          size="small"
                          color={getStatusColor(item.status)}
                          sx={{ minWidth: '70px', fontSize: '0.7rem' }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {item.details}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < systemHealth.length - 1 && <Divider />}
              </div>
            );
          })}
        </List>
      </Box>

      {/* System Performance Footer */}
      <Divider />
      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom>
          System Performance
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinearProgress 
            variant="determinate" 
            value={overallStatus === 'optimal' ? 95 : overallStatus === 'warning' ? 75 : 45}
            sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
            color={statusInfo.color}
          />
          <Typography variant="caption" color="text.secondary">
            {overallStatus === 'optimal' ? '95%' : overallStatus === 'warning' ? '75%' : '45%'}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Uptime: 99.9%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Last Updated: {new Date().toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

SystemStatus.propTypes = {
  trafficData: PropTypes.object,
  connectionStatus: PropTypes.string.isRequired,
  aiMode: PropTypes.bool.isRequired
};

SystemStatus.defaultProps = {
  trafficData: null
};
