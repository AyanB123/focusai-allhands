import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  launchAtStartup: true,
  minimizeToTray: true,
  trackingEnabled: true,
  idleThreshold: 5, // minutes
  workHours: {
    start: '09:00',
    end: '17:00'
  },
  workDays: [1, 2, 3, 4, 5], // Monday to Friday (0 = Sunday)
  notifications: {
    enabled: true,
    focusReminders: true,
    breakReminders: true,
    dailySummary: true
  }
};

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAppSettings: (state, action) => {
      return { ...state, ...action.payload };
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      // Save to electron store
      window.electron.setAppSettings({ ...state, theme: action.payload });
    },
    setLaunchAtStartup: (state, action) => {
      state.launchAtStartup = action.payload;
      window.electron.setAppSettings({ ...state, launchAtStartup: action.payload });
    },
    setMinimizeToTray: (state, action) => {
      state.minimizeToTray = action.payload;
      window.electron.setAppSettings({ ...state, minimizeToTray: action.payload });
    },
    setTrackingEnabled: (state, action) => {
      state.trackingEnabled = action.payload;
      window.electron.setAppSettings({ ...state, trackingEnabled: action.payload });
    },
    setIdleThreshold: (state, action) => {
      state.idleThreshold = action.payload;
      window.electron.setAppSettings({ ...state, idleThreshold: action.payload });
    },
    setWorkHours: (state, action) => {
      state.workHours = action.payload;
      window.electron.setAppSettings({ ...state, workHours: action.payload });
    },
    setWorkDays: (state, action) => {
      state.workDays = action.payload;
      window.electron.setAppSettings({ ...state, workDays: action.payload });
    },
    setNotificationSettings: (state, action) => {
      state.notifications = { ...state.notifications, ...action.payload };
      window.electron.setAppSettings({ ...state, notifications: state.notifications });
    }
  }
});

export const { 
  setAppSettings,
  setTheme, 
  setLaunchAtStartup, 
  setMinimizeToTray,
  setTrackingEnabled,
  setIdleThreshold,
  setWorkHours,
  setWorkDays,
  setNotificationSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;