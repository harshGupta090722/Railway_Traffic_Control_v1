// src/components/dashboard/AIRecommendations.js
'use client';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Paper, Typography, List, ListItem, ListItemText, ListItemIcon,
  Button, Chip, Box, Divider, Alert, LinearProgress, Card,
  CardContent, IconButton, Collapse, Badge
} from '@mui/material';
import {
  Psychology, TrendingUp, Warning, CheckCircle, Speed, Route,
  Schedule, ReportProblem, Lightbulb, ExpandMore, PlayArrow,
  Autorenew, Timeline
} from '@mui/icons-material';

export default function AIRecommendations({ 
  scenario, 
  aiMode, 
  onActionTaken, 
  demoRunning 
}) {
  const [recommendations, setRecommendations] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [expandedRec, setExpandedRec] = useState(null);
  const [executedCount, setExecutedCount] = useState(0);

  // Generate realistic AI recommendations based on scenario
  useEffect(() => {
    const generateRecommendations = () => {
      let recs = [];
      
      switch (scenario) {
        case 'congestion':
          recs = [
            {
              id: 1,
              type: 'PRIORITY',
              title: 'Prioritize Express Train EXP001',
              description: 'Delay LOCAL trains by 3-5 minutes to clear main line for express services. This will create a dedicated corridor for high-priority passenger traffic.',
              impact: '18% throughput improvement',
              confidence: 94,
              urgency: 'HIGH',
              icon: Speed,
              action: 'prioritize-exp001',
              estimatedBenefit: {
                throughputImprovement: 18,
                delayReduction: 7,
                affectedTrains: 3
              },
              detailedExplanation: 'Express trains carry more passengers and have higher priority. By temporarily delaying local services, we can maintain schedule adherence for inter-city connections.'
            },
            {
              id: 2,
              type: 'ROUTING',
              title: 'Reroute Freight to Track 3',
              description: 'Move FRG003 to parallel track to avoid passenger train conflicts during peak hours.',
              impact: '8 min delay reduction',
              confidence: 87,
              urgency: 'MEDIUM',
              icon: Route,
              action: 'reroute-frg003',
              estimatedBenefit: {
                throughputImprovement: 12,
                delayReduction: 8,
                affectedTrains: 2
              },
              detailedExplanation: 'Freight trains have flexible schedules. Using parallel infrastructure reduces bottlenecks at critical junctions.'
            },
            {
              id: 3,
              type: 'OPTIMIZATION',
              title: 'Dynamic Platform Assignment',
              description: 'AI suggests optimal platform assignments to reduce dwell time at stations.',
              impact: '15% station efficiency',
              confidence: 91,
              urgency: 'LOW',
              icon: Schedule,
              action: 'optimize-platforms',
              estimatedBenefit: {
                throughputImprovement: 8,
                delayReduction: 4,
                affectedTrains: 5
              },
              detailedExplanation: 'Real-time platform optimization reduces passenger boarding time and track occupancy.'
            }
          ];
          break;

        case 'emergency':
          recs = [
            {
              id: 4,
              type: 'EMERGENCY',
              title: 'Emergency Corridor Activation',
              description: 'Clear Track 1 for emergency services, hold all trains at nearest stations. Priority medical transport detected.',
              impact: 'Life-Critical Priority',
              confidence: 99,
              urgency: 'CRITICAL',
              icon: ReportProblem, // Changed from Emergency
              action: 'emergency-clear',
              estimatedBenefit: {
                throughputImprovement: -50,
                delayReduction: 0,
                affectedTrains: 6
              },
              detailedExplanation: 'Emergency protocol overrides all normal operations. All trains will be safely held until emergency vehicle passes.'
            }
          ];
          break;

        case 'optimized':
          if (aiMode) {
            recs = [
              {
                id: 5,
                type: 'OPTIMIZATION',
                title: 'Predictive Speed Optimization',
                description: 'AI adjusts train speeds based on real-time track conditions, weather, and traffic flow patterns.',
                impact: '32% energy efficiency gain',
                confidence: 91,
                urgency: 'LOW',
                icon: TrendingUp,
                action: 'optimize-speeds',
                estimatedBenefit: {
                  throughputImprovement: 22,
                  delayReduction: 8,
                  affectedTrains: 4
                },
                detailedExplanation: 'Machine learning algorithms optimize acceleration and braking patterns to maintain schedule while reducing energy consumption.'
              },
              {
                id: 6,
                type: 'SCHEDULING',
                title: 'Predictive Maintenance Scheduling',
                description: 'Schedule maintenance during optimal low-traffic windows based on predictive analytics.',
                impact: '25% uptime improvement',
                confidence: 88,
                urgency: 'LOW',
                icon: Schedule,
                action: 'schedule-maintenance',
                estimatedBenefit: {
                  throughputImprovement: 15,
                  delayReduction: 12,
                  affectedTrains: 0
                },
                detailedExplanation: 'AI predicts optimal maintenance windows to minimize service disruption while ensuring safety compliance.'
              }
            ];
          } else {
            recs = [
              {
                id: 7,
                type: 'SUGGESTION',
                title: 'Enable AI Mode for Optimization',
                description: 'Activate AI-powered traffic management to unlock advanced optimization features.',
                impact: 'Up to 40% improvement',
                confidence: 95,
                urgency: 'MEDIUM',
                icon: Psychology,
                action: 'enable-ai',
                estimatedBenefit: {
                  throughputImprovement: 35,
                  delayReduction: 15,
                  affectedTrains: 8
                },
                detailedExplanation: 'AI mode provides real-time optimization, predictive conflict resolution, and dynamic resource allocation.'
              }
            ];
          }
          break;

        default: // normal
          recs = [
            {
              id: 8,
              type: 'MONITORING',
              title: 'All Systems Optimal',
              description: 'Current traffic flow is within normal parameters. No immediate optimizations required.',
              impact: 'Baseline Performance',
              confidence: 85,
              urgency: 'LOW',
              icon: CheckCircle,
              action: null,
              estimatedBenefit: {
                throughputImprovement: 0,
                delayReduction: 0,
                affectedTrains: 0
              },
              detailedExplanation: 'System is operating efficiently. Continue monitoring for potential optimization opportunities.'
            }
          ];
          break;
      }
      
      return recs;
    };

    setRecommendations(generateRecommendations());
  }, [scenario, aiMode]);

  const handleActionClick = async (recommendation) => {
    if (!recommendation.action) return;

    setProcessing(true);
    
    try {
      // Simulate AI processing time for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Execute the action
      onActionTaken({
        type: 'AI_ACTION',
        action: recommendation.action,
        recommendationId: recommendation.id,
        timestamp: new Date().toISOString()
      });

      // Update recommendation status
      setRecommendations(prev =>
        prev.map(rec =>
          rec.id === recommendation.id 
            ? { ...rec, executed: true, status: 'COMPLETED' }
            : rec
        )
      );
      
      setExecutedCount(prev => prev + 1);
      
    } catch (error) {
      console.error('Failed to execute recommendation:', error);
    } finally {
      setProcessing(false);
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      default: return 'success';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'EMERGENCY': return ReportProblem; // Changed from Emergency
      case 'PRIORITY': return Speed;
      case 'ROUTING': return Route;
      case 'SCHEDULING': return Schedule;
      case 'OPTIMIZATION': return TrendingUp;
      case 'SUGGESTION': return Lightbulb;
      default: return CheckCircle;
    }
  };

  return (
    <Paper elevation={3} sx={{ height: 600, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        bgcolor: aiMode ? 'primary.main' : 'grey.100', 
        color: aiMode ? 'white' : 'text.primary',
        background: aiMode 
          ? 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge badgeContent={recommendations.filter(r => !r.executed).length} color="error">
              <Psychology sx={{ mr: 1 }} />
            </Badge>
            <Typography variant="h6">
              AI Recommendations
            </Typography>
          </Box>
          
          {executedCount > 0 && (
            <Chip
              label={`${executedCount} Executed`}
              size="small"
              color="success"
              icon={<CheckCircle />}
            />
          )}
        </Box>
        
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          {aiMode 
            ? 'AI Active - Real-time Analysis & Optimization'
            : 'AI Standby Mode - Enable for advanced recommendations'
          }
        </Typography>
      </Box>

      {/* Processing Indicator */}
      {processing && <LinearProgress />}

      {/* Recommendations List */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {!aiMode && scenario !== 'emergency' && (
          <Alert severity="info" sx={{ m: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Psychology />
              <Typography variant="body2">
                Enable AI Mode to receive intelligent recommendations
              </Typography>
            </Box>
          </Alert>
        )}

        <List>
          {recommendations.map((rec, index) => (
            <div key={rec.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  opacity: rec.executed ? 0.6 : 1,
                  bgcolor: rec.urgency === 'CRITICAL' ? 'error.light' : 'transparent',
                  '&:hover': {
                    bgcolor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <rec.icon color={rec.executed ? 'disabled' : 'primary'} />
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                        {rec.title}
                      </Typography>
                      <Chip
                        label={rec.urgency}
                        size="small"
                        color={getUrgencyColor(rec.urgency)}
                        variant="outlined"
                      />
                      {rec.type === 'OPTIMIZATION' && aiMode && (
                        <Chip
                          label="AI"
                          size="small"
                          color="primary"
                          icon={<Psychology />}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {rec.description}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 1
                      }}>
                        <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                          Impact: {rec.impact}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Confidence: {rec.confidence}%
                        </Typography>
                      </Box>

                      {rec.estimatedBenefit && (
                        <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                          {rec.estimatedBenefit.throughputImprovement !== 0 && (
                            <Chip
                              label={`${rec.estimatedBenefit.throughputImprovement > 0 ? '+' : ''}${rec.estimatedBenefit.throughputImprovement}% Throughput`}
                              size="small"
                              color={rec.estimatedBenefit.throughputImprovement > 0 ? 'success' : 'error'}
                              variant="outlined"
                            />
                          )}
                          {rec.estimatedBenefit.delayReduction > 0 && (
                            <Chip
                              label={`-${rec.estimatedBenefit.delayReduction} min delay`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {rec.action && !rec.executed ? (
                          <Button
                            variant="contained"
                            size="small"
                            sx={{ mt: 1 }}
                            disabled={processing}
                            onClick={() => handleActionClick(rec)}
                            startIcon={processing ? <Autorenew className="spinning" /> : <PlayArrow />}
                            color={rec.urgency === 'CRITICAL' ? 'error' : 'primary'}
                          >
                            {processing ? 'Executing...' : 'Execute'}
                          </Button>
                        ) : rec.executed ? (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            icon={<CheckCircle />}
                            sx={{ mt: 1 }}
                          />
                        ) : null}
                        
                        <IconButton
                          size="small"
                          onClick={() => setExpandedRec(expandedRec === rec.id ? null : rec.id)}
                        >
                          <ExpandMore 
                            sx={{ 
                              transform: expandedRec === rec.id ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 0.2s'
                            }} 
                          />
                        </IconButton>
                      </Box>

                      {/* Detailed Explanation */}
                      <Collapse in={expandedRec === rec.id}>
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            <strong>Detailed Analysis:</strong><br />
                            {rec.detailedExplanation}
                          </Typography>
                          
                          {rec.estimatedBenefit && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="caption" color="text.secondary">
                                Affected trains: {rec.estimatedBenefit.affectedTrains}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  }
                />
              </ListItem>
              {index < recommendations.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </Box>

      {/* Footer Stats */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderTop: 1, borderColor: 'grey.200' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Active: {recommendations.filter(r => !r.executed).length} | 
            Completed: {recommendations.filter(r => r.executed).length}
          </Typography>
          
          {aiMode && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" color="primary.main" sx={{ fontWeight: 600 }}>
                AI Optimization Active
              </Typography>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: 'success.main',
                  animation: 'pulse 2s infinite'
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}

AIRecommendations.propTypes = {
  scenario: PropTypes.oneOf(['normal', 'congestion', 'emergency', 'optimized']).isRequired,
  aiMode: PropTypes.bool.isRequired,
  onActionTaken: PropTypes.func.isRequired,
  demoRunning: PropTypes.bool
};

AIRecommendations.defaultProps = {
  demoRunning: false
};
