import { useState, useEffect, useCallback } from 'react';
import { getTrackingStatus, toggleTracking, onTrackingStatusChanged } from '../../shared/api';

/**
 * Hook for managing activity tracking
 * @returns {Object} Tracking status and toggle function
 */
const useTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrackingStatus = useCallback(async () => {
    try {
      setLoading(true);
      const status = await getTrackingStatus();
      setIsTracking(status);
      setError(null);
    } catch (err) {
      console.error('Error fetching tracking status:', err);
      setError(err.message || 'Failed to fetch tracking status');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleToggleTracking = useCallback(async () => {
    try {
      setLoading(true);
      const status = await toggleTracking();
      setIsTracking(status);
      setError(null);
      return status;
    } catch (err) {
      console.error('Error toggling tracking:', err);
      setError(err.message || 'Failed to toggle tracking');
      return isTracking;
    } finally {
      setLoading(false);
    }
  }, [isTracking]);

  useEffect(() => {
    fetchTrackingStatus();

    // Set up event listener for tracking status changes
    const removeListener = onTrackingStatusChanged((status) => {
      setIsTracking(status);
    });

    return () => {
      removeListener();
    };
  }, [fetchTrackingStatus]);

  return {
    isTracking,
    loading,
    error,
    toggleTracking: handleToggleTracking,
  };
};

export default useTracking;