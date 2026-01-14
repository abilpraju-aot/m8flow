/**
 * M8Flow i18n Module
 *
 * Provides function to initialize M8Flow translations.
 */

import i18n from 'i18next';

// M8Flow translations
const m8flowTranslations = {
  'm8flow.appName': 'M8Flow',
  'm8flow.dashboard.title': 'M8Flow Dashboard',
  'm8flow.dashboard.welcome': 'Welcome to M8Flow',
  'm8flow.navigation.dashboard': 'Dashboard',
  'm8flow.navigation.tenants': 'Tenants',
  'm8flow.navigation.templates': 'Templates',
  'm8flow.tenants.title': 'Tenant Management',
  'm8flow.tenants.description': 'Manage your organization tenants',
  'm8flow.templates.title': 'Process Templates',
  'm8flow.templates.description': 'Browse and manage process templates',
  'm8flow.common.loading': 'Loading...',
  'm8flow.common.error': 'An error occurred',
  'm8flow.common.save': 'Save',
  'm8flow.common.cancel': 'Cancel',
  'm8flow.common.delete': 'Delete',
  'm8flow.common.edit': 'Edit',
  'm8flow.common.create': 'Create',
};

/**
 * Initialize M8Flow translations
 *
 * Call this after i18n is initialized to add M8Flow translations.
 */
export function initM8FlowI18n(): void {
  if (i18n.isInitialized) {
    i18n.addResourceBundle('en-US', 'translation', m8flowTranslations, true, true);
    console.log('[M8Flow] i18n translations loaded');
  } else {
    i18n.on('initialized', () => {
      i18n.addResourceBundle('en-US', 'translation', m8flowTranslations, true, true);
      console.log('[M8Flow] i18n translations loaded (deferred)');
    });
  }
}

/**
 * Helper to get M8Flow translation key
 */
export function m8flowKey(key: string): string {
  return key.startsWith('m8flow.') ? key : `m8flow.${key}`;
}
