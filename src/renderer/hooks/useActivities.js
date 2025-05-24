import { useState, useEffect, useCallback } from 'react';
import { getActivitiesByDate, onActivityUpdate, onDataImported } from '../../shared/api';

/**
 * Hook for fetching and managing activities
 * @param {string|Date} date - The date to fetch activities for
 * @returns {Object} Activities data and loading state
 */
const useActivities = (date = new Date()) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getActivitiesByDate(date instanceof Date ? date.toISOString() : date);
      setActivities(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchActivities();

    // Set up event listeners for activity updates and data imports
    const removeActivityListener = onActivityUpdate(() => {
      fetchActivities();
    });

    const removeDataImportedListener = onDataImported(() => {
      fetchActivities();
    });

    return () => {
      removeActivityListener();
      removeDataImportedListener();
    };
  }, [fetchActivities]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
};

export default useActivities;