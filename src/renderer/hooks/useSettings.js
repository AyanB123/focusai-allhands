import { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSettings } from '../../shared/api';

/**
 * Hook for fetching and managing settings
 * @returns {Object} Settings data and update function
 */
const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveSettings = useCallback(async (newSettings) => {
    try {
      setLoading(true);
      await updateSettings(newSettings);
      setSettings(newSettings);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err.message || 'Failed to update settings');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    saveSettings,
    refetch: fetchSettings,
  };
};

export default useSettings;