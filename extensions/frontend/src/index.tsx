/**
 * M8Flow Frontend Entry Point
 * 
 * This is the standalone entry point for M8Flow frontend.
 * It imports upstream Spiff components and wraps them with M8Flow customizations.
 * 
 * NO UPSTREAM CODE IS MODIFIED - all customizations are in extensions/frontend.
 */

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Import upstream styles and i18n
import '@spiff/index.scss';
import '@spiff/index.css';
import '@spiff/i18n';

// Import M8Flow customizations
import { initM8FlowI18n } from './i18n';
import './styles/index.scss';

// Import M8Flow App (wraps upstream)
import M8FlowApp from './M8FlowApp';

// Initialize M8Flow translations
initM8FlowI18n();

// @ts-expect-error TS(2345) FIXME: Argument of type 'HTMLElement | null' is not assignable
const root = ReactDOMClient.createRoot(document.getElementById('root'));

/**
 * Creates an instance of the MUI theme that can be fed to the top-level ThemeProvider.
 * Nested ThemeProviders can be used to override specific components.
 * This override implements a tooltip that fits the overall app theme.
 */
const defaultTheme = createTheme();
const overrideTheme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        arrow: {
          '&::before': {
            color: '#F5F5F5',
            border: '1px solid grey',
          },
        },
        tooltip: {
          fontSize: '.8em',
          color: 'black',
          backgroundColor: '#F5F5F5',
          padding: '5px',
          border: '1px solid  grey',
        },
      },
    },
  },
});

const doRender = () => {
  root.render(
    <React.StrictMode>
      <ThemeProvider theme={defaultTheme}>
        <ThemeProvider theme={overrideTheme}>
          <M8FlowApp />
        </ThemeProvider>
      </ThemeProvider>
    </React.StrictMode>,
  );
};

doRender();
