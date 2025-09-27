'use client';

import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import theme from '@/lib/theme';

function CustomThemeProvider({ children }) {
  return (
    <AppRouterCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

CustomThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CustomThemeProvider;