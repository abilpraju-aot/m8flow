/**
 * M8Flow i18n Extension
 *
 * This module extends the upstream Spiff i18n configuration with
 * M8Flow-specific translations. It is imported AFTER the upstream
 * App component which initializes i18n.
 */

import i18n from 'i18next';

// Import M8Flow translation files
import m8flowEnUS from './en_us/m8flow.json';

/**
 * Add M8Flow translations to the i18n instance
 *
 * Note: We check if i18n is initialized before adding resources
 * to handle cases where this module loads before upstream i18n.
 */
const addM8FlowTranslations = () => {
  // Wait for i18n to be initialized if needed
  if (!i18n.isInitialized) {
    i18n.on('initialized', () => {
      i18n.addResourceBundle('en-US', 'translation', m8flowEnUS, true, true);
      if (process.env.NODE_ENV === 'development') {
        console.log('[M8Flow] i18n translations loaded (deferred)');
      }
    });
  } else {
    // i18n already initialized, add resources immediately
    i18n.addResourceBundle('en-US', 'translation', m8flowEnUS, true, true);
    if (process.env.NODE_ENV === 'development') {
      console.log('[M8Flow] i18n translations loaded');
    }
  }
};

addM8FlowTranslations();

/**
 * Helper to get M8Flow translation key
 */
export function m8flowKey(key: string): string {
  return key.startsWith('m8flow.') ? key : `m8flow.${key}`;
}

export default i18n;
