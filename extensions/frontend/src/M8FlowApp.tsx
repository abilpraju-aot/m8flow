/**
 * M8FlowApp - Main Application Component
 * 
 * This component wraps upstream Spiff components and provides:
 * - M8Flow custom routes (higher priority than upstream)
 * - M8Flow theme (extends Spiff theme)
 * - M8Flow configuration provider
 * - M8Flow navigation items
 * 
 * NO UPSTREAM CODE IS MODIFIED - all customizations are injected here.
 */

import { defineAbility } from '@casl/ability';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@mui/material/styles';

// Import upstream Spiff components (NO MODIFICATIONS TO UPSTREAM)
import { AbilityContext } from '@spiff/contexts/Can';
import APIErrorProvider from '@spiff/contexts/APIErrorContext';
import ContainerForExtensions from '@spiff/ContainerForExtensions';
import PublicRoutes from '@spiff/views/PublicRoutes';
import { CONFIGURATION_ERRORS } from '@spiff/config';

// Import M8Flow customizations
import { m8flowRoutes } from './routes';
import { M8FlowConfigProvider } from './config';
import { createM8FlowTheme } from './theme';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Configuration Error Display
 */
function ConfigurationErrorDisplay() {
  if (CONFIGURATION_ERRORS.length === 0) {
    return null;
  }

  return (
    <div style={{ padding: '20px', color: 'red' }}>
      <h2>Configuration Errors</h2>
      <ul>
        {CONFIGURATION_ERRORS.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Main Layout Component
 * 
 * Provides the provider hierarchy for the application:
 * - ThemeProvider with M8Flow theme
 * - QueryClientProvider for React Query
 * - APIErrorProvider for error handling
 * - AbilityContext for CASL permissions
 * - M8FlowConfigProvider for M8Flow-specific configuration
 */
function M8FlowLayout() {
  const ability = defineAbility(() => {});
  
  // Get theme mode from localStorage or default to light
  const storedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  const m8flowTheme = createM8FlowTheme(storedTheme);

  if (CONFIGURATION_ERRORS.length > 0) {
    return <ConfigurationErrorDisplay />;
  }

  return (
    <div className="cds--white">
      <ThemeProvider theme={m8flowTheme}>
        <QueryClientProvider client={queryClient}>
          <APIErrorProvider>
            <AbilityContext.Provider value={ability}>
              <M8FlowConfigProvider>
                <Outlet />
              </M8FlowConfigProvider>
              <ReactQueryDevtools initialIsOpen={false} />
            </AbilityContext.Provider>
          </APIErrorProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </div>
  );
}

/**
 * M8FlowApp Component
 * 
 * The main application component that sets up routing and providers.
 * M8Flow routes take priority, then upstream routes.
 */
export default function M8FlowApp() {
  const routeComponents = () => {
    return [
      // M8Flow custom routes - these take priority
      ...m8flowRoutes,
      
      // Public routes (sign-out, public forms, etc.)
      { path: 'public/*', element: <PublicRoutes /> },
      
      // Fallback to upstream Spiff for all other routes
      {
        path: '*',
        element: <ContainerForExtensions />,
      },
    ];
  };

  const router = createBrowserRouter([
    {
      path: '*',
      Component: M8FlowLayout,
      children: routeComponents(),
    },
  ]);

  return <RouterProvider router={router} />;
}
