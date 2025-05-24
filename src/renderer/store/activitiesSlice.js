import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activities: [],
  currentActivity: null,
  isTracking: false,
  dailySummary: {
    productive: 0,
    neutral: 0,
    distracting: 0
  },
  categories: {
    productive: ['code-editor', 'terminal', 'documentation'],
    neutral: ['browser-work', 'email', 'meeting'],
    distracting: ['social-media', 'entertainment', 'games']
  },
  customCategories: {}
};

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    setActivities: (state, action) => {
      state.activities = action.payload;
    },
    addActivity: (state, action) => {
      state.activities.push(action.payload);
    },
    setCurrentActivity: (state, action) => {
      state.currentActivity = action.payload;
    },
    setIsTracking: (state, action) => {
      state.isTracking = action.payload;
    },
    updateDailySummary: (state, action) => {
      state.dailySummary = action.payload;
    },
    addCustomCategory: (state, action) => {
      const { name, type, apps } = action.payload;
      state.customCategories[name] = { type, apps };
    },
    removeCustomCategory: (state, action) => {
      const { name } = action.payload;
      delete state.customCategories[name];
    },
    updateCategoryType: (state, action) => {
      const { app, newType } = action.payload;
      
      // Remove from current category
      Object.keys(state.categories).forEach(category => {
        state.categories[category] = state.categories[category].filter(a => a !== app);
      });
      
      // Add to new category
      state.categories[newType].push(app);
    }
  }
});

export const { 
  setActivities,
  addActivity,
  setCurrentActivity,
  setIsTracking,
  updateDailySummary,
  addCustomCategory,
  removeCustomCategory,
  updateCategoryType
} = activitiesSlice.actions;

export default activitiesSlice.reducer;