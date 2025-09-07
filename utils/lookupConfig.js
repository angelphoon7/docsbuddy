/**
 * Lookup Configuration
 * Configuration settings for the AI response lookup feature
 */

export const LOOKUP_CONFIG = {
  // Feature toggles
  ENABLE_AUTO_LOOKUP: true,
  ENABLE_CODE_ANALYSIS: true,
  ENABLE_DOCUMENTATION_LOOKUP: true,
  ENABLE_TOOLS_LOOKUP: true,
  
  // Display settings
  AUTO_SHOW_INSIGHTS: true,
  MAX_INSIGHTS_DISPLAY: 5,
  EXPAND_BY_DEFAULT: false,
  
  // Analysis thresholds
  MIN_RESPONSE_LENGTH_FOR_LOOKUP: 100,
  MAX_LOOKUP_DELAY_MS: 2000,
  
  // Storage settings
  STORE_LOOKUP_HISTORY: true,
  MAX_STORED_LOOKUPS: 100,
  
  // Priority levels
  PRIORITY_LEVELS: {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
  },
  
  // Lookup types configuration
  LOOKUP_TYPES: {
    CODE_REFERENCES: {
      enabled: true,
      priority: 'medium',
      autoExpand: false
    },
    DOCUMENTATION_LINKS: {
      enabled: true,
      priority: 'high',
      autoExpand: true
    },
    TOOLS_AND_LIBRARIES: {
      enabled: true,
      priority: 'medium',
      autoExpand: false
    },
    RELATED_TOPICS: {
      enabled: true,
      priority: 'low',
      autoExpand: false
    }
  },
  
  // UI settings
  UI: {
    ANIMATION_DURATION: 300,
    MAX_HEIGHT_EXPANDED: '24rem', // 384px
    MAX_HEIGHT_COLLAPSED: '8rem', // 128px
    SHOW_CLOSE_BUTTON: true,
    SHOW_EXPAND_BUTTON: true
  }
};

// User preferences (can be customized per user)
export const USER_PREFERENCES = {
  // Lookup frequency
  LOOKUP_FREQUENCY: 'all', // 'all', 'important', 'manual'
  
  // Notification settings
  SHOW_LOOKUP_NOTIFICATIONS: true,
  NOTIFICATION_DURATION: 5000,
  
  // Display preferences
  PREFERRED_TAB: 'insights', // 'insights', 'suggestions', 'details'
  COMPACT_MODE: false,
  
  // Content filtering
  FILTER_LOW_PRIORITY: false,
  SHOW_TECHNICAL_DETAILS: true
};

// Environment-specific settings
export const ENV_CONFIG = {
  DEVELOPMENT: {
    DEBUG_MODE: true,
    LOG_LOOKUP_RESULTS: true,
    MOCK_LOOKUP_DATA: false
  },
  PRODUCTION: {
    DEBUG_MODE: false,
    LOG_LOOKUP_RESULTS: false,
    MOCK_LOOKUP_DATA: false
  }
};

// Get current environment configuration
export function getCurrentEnvConfig() {
  const env = process.env.NODE_ENV || 'development';
  return ENV_CONFIG[env.toUpperCase()] || ENV_CONFIG.DEVELOPMENT;
}

// Get effective configuration combining global and user preferences
export function getEffectiveConfig(userPrefs = {}) {
  return {
    ...LOOKUP_CONFIG,
    ...USER_PREFERENCES,
    ...userPrefs,
    env: getCurrentEnvConfig()
  };
}

// Validate configuration
export function validateConfig(config) {
  const errors = [];
  
  if (config.MAX_LOOKUP_DELAY_MS < 0) {
    errors.push('MAX_LOOKUP_DELAY_MS must be non-negative');
  }
  
  if (config.MAX_STORED_LOOKUPS < 1) {
    errors.push('MAX_STORED_LOOKUPS must be at least 1');
  }
  
  if (config.MIN_RESPONSE_LENGTH_FOR_LOOKUP < 0) {
    errors.push('MIN_RESPONSE_LENGTH_FOR_LOOKUP must be non-negative');
  }
  
  return errors;
}

export default LOOKUP_CONFIG;

