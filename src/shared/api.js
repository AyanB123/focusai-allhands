/**
 * API module for interacting with the Electron main process
 */

// Settings API
export const getSettings = async () => {
  return window.electron.getSettings();
};

export const updateSettings = async (settings) => {
  return window.electron.updateSettings(settings);
};

// Activities API
export const getActivities = async () => {
  return window.electron.getActivities();
};

export const getActivitiesByDate = async (date) => {
  return window.electron.getActivitiesByDate(date);
};

export const addActivity = async (activity) => {
  return window.electron.addActivity(activity);
};

// Categories API
export const getCategories = async () => {
  return window.electron.getCategories();
};

export const updateCategories = async (categories) => {
  return window.electron.updateCategories(categories);
};

// Analytics API
export const getProductivityScore = async (date) => {
  return window.electron.getProductivityScore(date);
};

// Tracking API
export const getTrackingStatus = async () => {
  return window.electron.getTrackingStatus();
};

export const toggleTracking = async () => {
  return window.electron.toggleTracking();
};

// Data export/import API
export const exportData = async () => {
  return window.electron.exportData();
};

export const importData = async (data) => {
  return window.electron.importData(data);
};

export const exportDataToFile = async () => {
  return window.electron.exportDataToFile();
};

export const importDataFromFile = async () => {
  return window.electron.importDataFromFile();
};

// ML API
export const classifyActivity = async (activity) => {
  return window.electron.classifyActivity(activity);
};

export const trainClassifier = async (activities, categories) => {
  return window.electron.trainClassifier(activities, categories);
};

export const predictProductivity = async (activities) => {
  return window.electron.predictProductivity(activities);
};

export const trainProductivityPredictor = async (activitiesList, scores) => {
  return window.electron.trainProductivityPredictor(activitiesList, scores);
};

export const generateRecommendations = async (activities, maxRecommendations = 3) => {
  return window.electron.generateRecommendations(activities, maxRecommendations);
};

// System API
export const getAppVersion = async () => {
  return window.electron.getAppVersion();
};

// App control API
export const minimizeApp = () => {
  window.electron.minimizeApp();
};

export const maximizeApp = () => {
  window.electron.maximizeApp();
};

export const closeApp = () => {
  window.electron.closeApp();
};

// Event listeners
export const onTrackingStatusChanged = (callback) => {
  window.electron.on('tracking-status-changed', callback);
  return () => window.electron.removeAllListeners('tracking-status-changed');
};

export const onActivityUpdate = (callback) => {
  window.electron.on('activity-update', callback);
  return () => window.electron.removeAllListeners('activity-update');
};

export const onDataImported = (callback) => {
  window.electron.on('data-imported', callback);
  return () => window.electron.removeAllListeners('data-imported');
};

export const onNotification = (callback) => {
  window.electron.on('notification', callback);
  return () => window.electron.removeAllListeners('notification');
};