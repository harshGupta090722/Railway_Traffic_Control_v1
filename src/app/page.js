'use client';

import PropTypes from 'prop-types';
import { 
  Container, 
  Typography, 
  Button, 
  Paper, 
  Box,
  Grid,
  Card,
  CardContent,
  Chip
} from '@mui/material';
import { 
  Train, 
  Speed, 
  CheckCircle,
  Psychology 
} from '@mui/icons-material';

export default function Home() {
  const testFeatures = [
    { name: 'Next.js 14', status: 'Working', color: 'success' },
    { name: 'Material-UI v5', status: 'Working', color: 'success' }, 
    { name: 'JavaScript', status: 'Working', color: 'success' },
    { name: 'Spline 3D', status: 'Ready', color: 'info' },
    { name: 'Theme System', status: 'Working', color: 'success' },
  ];

  const handleNextSteps = (action) => {
    console.log(`Ready to ${action}!`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          mb: 4, 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #1976d2 0%, #2e7d32 100%)', 
          color: 'white' 
        }}
      >
        <Train sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h3" gutterBottom>
          SIH 2025 Railway Traffic Control
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          AI-Powered Train Management System - JavaScript Setup Complete! 🚀
        </Typography>
      </Paper>

      {/* Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {testFeatures.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  {feature.name}
                </Typography>
                <Chip 
                  label={feature.status} 
                  color={feature.color}
                  size="small"
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Next Steps */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Psychology sx={{ mr: 1 }} />
          Next Steps
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Your JavaScript project is successfully set up! Here's what to do next:
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button 
            variant="contained" 
            startIcon={<Speed />}
            onClick={() => handleNextSteps('build components')}
          >
            Build Components
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => handleNextSteps('setup database connection')}
          >
            Setup Database
          </Button>
          <Button 
            variant="outlined"
            onClick={() => handleNextSteps('create 3D scene')}
          >
            Design 3D Scene
          </Button>
        </Box>
      </Paper>

      {/* JavaScript Features Highlight */}
      <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ mr: 1, fontSize: 18 }} />
          <strong>JavaScript Ready:</strong> PropTypes for type checking, JSConfig for IntelliSense, and ES6+ features enabled
        </Typography>
      </Paper>
    </Container>
  );
}

// PropTypes validation (replaces TypeScript types)
Home.propTypes = {
  // Add prop types as needed when this component receives props
};