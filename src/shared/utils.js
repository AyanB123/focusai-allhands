/**
 * Format a timestamp to a readable time string (HH:MM)
 * @param {number} timestamp - The timestamp to format
 * @returns {string} The formatted time string
 */
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format a timestamp to a readable date string (YYYY-MM-DD)
 * @param {number} timestamp - The timestamp to format
 * @returns {string} The formatted date string
 */
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format a duration in milliseconds to a readable string (HH:MM:SS)
 * @param {number} duration - The duration in milliseconds
 * @returns {string} The formatted duration string
 */
const formatDuration = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60);
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

/**
 * Get the category of an activity based on the application name
 * @param {string} appName - The name of the application
 * @param {Object} categories - The categories configuration
 * @returns {string} The category of the activity
 */
const getActivityCategory = (appName, categories) => {
  if (categories.productive.includes(appName)) {
    return 'productive';
  } else if (categories.distracting.includes(appName)) {
    return 'distracting';
  } else {
    return 'neutral';
  }
};

/**
 * Group activities by hour
 * @param {Array} activities - The activities to group
 * @returns {Object} The activities grouped by hour
 */
const groupActivitiesByHour = (activities) => {
  const groupedActivities = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.startTime);
    const hour = date.getHours();
    
    if (!groupedActivities[hour]) {
      groupedActivities[hour] = [];
    }
    
    groupedActivities[hour].push(activity);
  });
  
  return groupedActivities;
};

/**
 * Calculate the productivity score based on the activities
 * @param {Array} activities - The activities to calculate the score from
 * @param {Object} categories - The categories configuration
 * @returns {number} The productivity score (0-100)
 */
const calculateProductivityScore = (activities, categories) => {
  if (activities.length === 0) return 0;
  
  let productiveTime = 0;
  let totalTime = 0;
  
  activities.forEach(activity => {
    const duration = activity.endTime - activity.startTime;
    totalTime += duration;
    
    if (activity.category === 'productive') {
      productiveTime += duration;
    }
  });
  
  return totalTime > 0 ? Math.round((productiveTime / totalTime) * 100) : 0;
};

/**
 * Get the time distribution by category
 * @param {Array} activities - The activities to calculate the distribution from
 * @returns {Object} The time distribution by category
 */
const getTimeDistribution = (activities) => {
  const distribution = {
    productive: 0,
    neutral: 0,
    distracting: 0,
  };
  
  activities.forEach(activity => {
    const duration = activity.endTime - activity.startTime;
    distribution[activity.category] += duration;
  });
  
  return distribution;
};

/**
 * Get the top applications by usage time
 * @param {Array} activities - The activities to calculate from
 * @param {number} limit - The maximum number of applications to return
 * @returns {Array} The top applications
 */
const getTopApplications = (activities, limit = 5) => {
  const appUsage = {};
  
  activities.forEach(activity => {
    const duration = activity.endTime - activity.startTime;
    
    if (!appUsage[activity.application]) {
      appUsage[activity.application] = 0;
    }
    
    appUsage[activity.application] += duration;
  });
  
  const sortedApps = Object.entries(appUsage)
    .map(([app, duration]) => ({ app, duration }))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, limit);
  
  return sortedApps;
};

module.exports = {
  formatTime,
  formatDate,
  formatDuration,
  getActivityCategory,
  groupActivitiesByHour,
  calculateProductivityScore,
  getTimeDistribution,
  getTopApplications,
};