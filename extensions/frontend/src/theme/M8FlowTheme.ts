/**
 * M8Flow Theme
 *
 * Extends the upstream Spiff theme with M8Flow branding.
 * M8Flow customizations take precedence over Spiff defaults.
 */

import { PaletteMode, ThemeOptions, createTheme } from '@mui/material';
import {
  blue,
  blueGrey,
  green,
  grey,
  orange,
  red,
  yellow,
} from '@mui/material/colors';
import merge from 'lodash.merge';

// Import upstream Spiff theme to extend
// Using @spiff alias (defined in upstream vite.config.ts)
// Note: This works because we're running from upstream's vite context
import { createSpiffTheme } from '@spiff/assets/theme/SpiffTheme';

export type M8FlowThemeMode = PaletteMode;

/**
 * M8Flow brand colors - customize these to match your brand
 */
export const M8_BRAND_COLORS = {
  primary: '#1E40AF', // M8Flow Blue
  primaryLight: '#3B82F6',
  primaryDark: '#1E3A8A',
  secondary: '#7C3AED', // M8Flow Purple
  secondaryLight: '#A78BFA',
  secondaryDark: '#5B21B6',
  accent: '#F59E0B', // M8Flow Gold/Amber
  accentLight: '#FCD34D',
  accentDark: '#D97706',
};

/**
 * M8Flow custom palette
 */
const m8flowPalette = (mode: PaletteMode) => {
  const lightModeColors = {
    primary: {
      main: M8_BRAND_COLORS.primary,
      light: M8_BRAND_COLORS.primaryLight,
      dark: M8_BRAND_COLORS.primaryDark,
      contrastText: '#ffffff',
    },
    secondary: {
      main: M8_BRAND_COLORS.secondary,
      light: M8_BRAND_COLORS.secondaryLight,
      dark: M8_BRAND_COLORS.secondaryDark,
      contrastText: '#ffffff',
    },
    success: {
      main: green[600],
      light: green[400],
      dark: green[800],
    },
    warning: {
      main: orange[600],
      light: orange[400],
      dark: orange[800],
    },
    error: {
      main: red[600],
      light: red[400],
      dark: red[800],
    },
    info: {
      main: blue[600],
      light: blue[400],
      dark: blue[800],
    },
    background: {
      default: grey[50],
      paper: '#ffffff',
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: grey[400],
    },
  };

  const darkModeColors = {
    primary: {
      main: M8_BRAND_COLORS.primaryLight,
      light: '#60A5FA',
      dark: M8_BRAND_COLORS.primary,
      contrastText: '#ffffff',
    },
    secondary: {
      main: M8_BRAND_COLORS.secondaryLight,
      light: '#C4B5FD',
      dark: M8_BRAND_COLORS.secondary,
      contrastText: '#ffffff',
    },
    success: {
      main: green[400],
      light: green[300],
      dark: green[600],
    },
    warning: {
      main: orange[400],
      light: orange[300],
      dark: orange[600],
    },
    error: {
      main: red[400],
      light: red[300],
      dark: red[600],
    },
    info: {
      main: blue[400],
      light: blue[300],
      dark: blue[600],
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: grey[100],
      secondary: grey[300],
      disabled: grey[600],
    },
  };

  return mode === 'light' ? lightModeColors : darkModeColors;
};

/**
 * M8Flow component overrides
 */
const m8flowComponents = (mode: PaletteMode) => ({
  MuiButton: {
    styleOverrides: {
      root: {
        fontSize: '14px',
        borderRadius: 8,
        textTransform: 'none' as const,
        fontWeight: 500,
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        boxShadow:
          mode === 'light'
            ? '0 1px 3px rgba(0,0,0,0.1)'
            : '0 1px 3px rgba(0,0,0,0.3)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      rounded: {
        borderRadius: 12,
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
        },
      },
    },
  },
});

/**
 * M8Flow typography
 */
const m8flowTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  button: {
    textTransform: undefined,
    fontWeight: 500,
  },
  h1: { fontSize: '2rem', fontWeight: 600 },
  h2: { fontSize: '1.75rem', fontWeight: 600 },
  h3: { fontSize: '1.5rem', fontWeight: 600 },
  h4: { fontSize: '1.25rem', fontWeight: 600 },
  h5: { fontSize: '1rem', fontWeight: 600 },
  h6: { fontSize: '0.875rem', fontWeight: 600 },
};

/**
 * Creates the M8Flow theme by extending the upstream Spiff theme.
 * M8Flow customizations take precedence over Spiff defaults.
 *
 * @param mode - 'light' or 'dark' theme mode
 * @returns MUI Theme object
 */
export const createM8FlowTheme = (mode: M8FlowThemeMode = 'light') => {
  // Get the base Spiff theme
  const baseSpiffTheme = createSpiffTheme(mode);

  // M8Flow theme overrides
  const m8flowOverrides: ThemeOptions = {
    palette: {
      mode,
      ...m8flowPalette(mode),
    },
    typography: m8flowTypography,
    components: m8flowComponents(mode),
    shape: {
      borderRadius: 8,
    },
  };

  // Deep merge: M8Flow overrides take precedence over Spiff defaults
  const mergedTheme = merge({}, baseSpiffTheme, m8flowOverrides);

  return createTheme(mergedTheme);
};
