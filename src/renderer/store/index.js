import { configureStore } from '@reduxjs/toolkit';
import settingsReducer from './settingsSlice';
import activitiesReducer from './activitiesSlice';

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    activities: activitiesReducer,
  },
});