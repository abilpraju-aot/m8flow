/**
 * M8Flow Integration Point
 *
 * This file provides integration with M8Flow extensions.
 * All M8Flow customizations live in ../extensions/frontend/src/
 */

// Re-export M8Flow routes
export { m8flowRoutes, isM8FlowRoute, getM8FlowRoutePaths } from '@m8flow/routes';

// Re-export M8Flow theme
export { createM8FlowTheme, M8_BRAND_COLORS } from '@m8flow/theme';

// Re-export M8Flow i18n
export { initM8FlowI18n } from '@m8flow/i18n';

// Re-export M8Flow config
export { useM8FlowConfig, useM8FlowFeature, M8FlowConfigProvider } from '@m8flow/config';
