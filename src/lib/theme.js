'use client';

import { createTheme } from '@mui/material/styles';
import { red, blue, green, orange } from '@mui/material/colors';

// Define color palette for railway system
const railwayColors = {
  primary: {
    main: '#1976d2', // Railway blue
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#2e7d32', // Signal green  
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f', // Alert red
    light: '#ef5350', 
    dark: '#c62828',
    contrastText: '#fff',
  },
  warning: {
    main: '#ff9800', // Caution orange
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#000',
  },
  info: {
    main: '#0288d1', // Information blue
    light: '#03a9f4',
    dark: '#01579b', 
    contrastText: '#fff',
  },
  success: {
    main: '#388e3c', // Success green
    light: '#66bb6a',
    dark: '#2e7d32',
    contrastText: '#fff',
  },
};

// Create custom theme for railway dashboard
export const theme = createTheme({
  palette: {
    mode: 'light',
    ...railwayColors,
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#212121',
      secondary: '#757575',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
        containedPrimary: {
          backgroundColor: railwayColors.primary.main,
          '&:hover': {
            backgroundColor: railwayColors.primary.dark,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;