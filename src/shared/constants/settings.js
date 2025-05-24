/**
 * Application themes
 */
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

/**
 * Default settings
 */
const DEFAULT_SETTINGS = {
  theme: THEMES.SYSTEM,
  startAtLogin: false,
  startTrackingOnLaunch: true,
  notifications: true,
  notificationFrequency: 60, // minutes
  workHours: {
    start: '09:00',
    end: '17:00',
  },
  workDays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
  productivityGoal: 70, // percentage
  enableMlFeatures: true,
  idleThreshold: 5, // minutes
};

module.exports = {
  THEMES,
  DEFAULT_SETTINGS,
};