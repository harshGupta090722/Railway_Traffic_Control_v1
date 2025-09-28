// src/components/dashboard/ConflictManager.js
'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Chip, IconButton, Box, Alert
} from '@mui/material';
import {
  Warning, CheckCircle, Error, Visibility, Psychology,
  Speed, Route, ReportProblem
} from '@mui/icons-material';

export default function ConflictManager({ trafficData, aiMode, scenario }) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    const generateConflicts = () => {
      let conflictList = [];

      switch (scenario) {
        case 'congestion':
          conflictList = [
            {
              id: 'CONF001',
              type: 'CROSSING',
              severity: 'HIGH',
              involvedTrains: ['EXP001', 'LOC002'],
              location: 'Junction Alpha',
              estimatedResolutionTime: 8,
              aiSuggestion: 'Delay LOC002 by 3 minutes'
            },
            {
              id: 'CONF002',
              type: 'PLATFORM_CONFLICT',
              severity: 'MEDIUM',
              involvedTrains: ['FRG003'],
              location: 'Central Station Platform 2',
              estimatedResolutionTime: 5,
              aiSuggestion: 'Reroute to Platform 3'
            }
          ];
          break;
        case 'emergency':
          conflictList = [
            {
              id: 'EMRG001',
              type: 'EMERGENCY',
              severity: 'CRITICAL',
              involvedTrains: ['EXP001'],
              location: 'Emergency Corridor',
              estimatedResolutionTime: 15,
              aiSuggestion: 'Clear all tracks immediately'
            }
          ];
          break;
        case 'optimized':
          if (!aiMode) {
            conflictList = [
              {
                id: 'OPT001',
                type: 'SPEED_CONFLICT',
                severity: 'LOW',
                involvedTrains: ['EXP004'],
                location: 'Main Line Section 3',
                estimatedResolutionTime: 2,
                aiSuggestion: 'Enable AI optimization'
              }
            ];
          }
          break;
        default: // normal
          if (!aiMode) {
            conflictList = [
              {
                id: 'NORM001',
                type: 'MINOR_DELAY',
                severity: 'LOW',
                involvedTrains: ['LOC002'],
                location: 'Suburban Junction',
                estimatedResolutionTime: 3,
                aiSuggestion: 'Adjust schedule by 2 minutes'
              }
            ];
          }
      }

      return conflictList;
    };

    setConflicts(generateConflicts());
  }, [scenario, aiMode]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'info';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return ReportProblem; // Changed from Emergency
      case 'HIGH': return Error;
      case 'MEDIUM': return Warning;
      case 'LOW': return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EMERGENCY': return ReportProblem; // Changed from Emergency
      case 'CROSSING': return Route;
      case 'SPEED_CONFLICT': return Speed;
      default: return Warning;
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <Warning sx={{ mr: 1 }} />
        Conflict Management
        {conflicts.length > 0 && (
          <Chip 
            label={`${conflicts.length} Active`} 
            color="error" 
            size="small" 
            sx={{ ml: 2 }}
          />
        )}
      </Typography>

      {conflicts.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 6, 
          color: 'text.secondary',
          bgcolor: 'success.light',
          borderRadius: 1,
          mt: 2
        }}>
          <CheckCircle sx={{ fontSize: 48, mb: 2, color: 'success.main' }} />
          <Typography variant="h6" color="success.dark">
            No Active Conflicts
          </Typography>
          <Typography variant="body2" color="success.dark">
            All railway operations running smoothly
            {aiMode && ' with AI optimization'}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mt: 2 }}>
          {/* AI Assistance Banner */}
          {aiMode && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Psychology sx={{ mr: 1 }} />
                <Typography variant="body2">
                  AI is actively analyzing conflicts and providing resolution suggestions
                </Typography>
              </Box>
            </Alert>
          )}

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Conflict ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {conflicts.map((conflict) => {
                  const SeverityIcon = getSeverityIcon(conflict.severity);
                  const TypeIcon = getTypeIcon(conflict.type);
                  
                  return (
                    <TableRow key={conflict.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TypeIcon sx={{ mr: 1, fontSize: 18 }} />
                          {conflict.id}
                        </Box>
                      </TableCell>
                      <TableCell>{conflict.type.replace('_', ' ')}</TableCell>
                      <TableCell>
                        <Chip
                          icon={<SeverityIcon />}
                          label={conflict.severity}
                          color={getSeverityColor(conflict.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {conflict.location}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Trains: {conflict.involvedTrains.join(', ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {conflict.estimatedResolutionTime} min
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" size="small">
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* AI Suggestions */}
          {aiMode && conflicts.length > 0 && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: 'info.dark'
              }}>
                <Psychology sx={{ mr: 1 }} />
                AI Recommendations:
              </Typography>
              {conflicts.map((conflict, index) => (
                <Typography key={index} variant="body2" sx={{ mb: 0.5, color: 'info.dark' }}>
                  • {conflict.id}: {conflict.aiSuggestion}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
}

ConflictManager.propTypes = {
  trafficData: PropTypes.object,
  aiMode: PropTypes.bool.isRequired,
  scenario: PropTypes.string.isRequired
};

ConflictManager.defaultProps = {
  trafficData: null
};
