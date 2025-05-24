import { useState, useCallback } from 'react';
import { classifyActivity, trainClassifier } from '../../shared/api';

/**
 * Hook for interacting with the ML classifier
 * @returns {Object} Classification functions and state
 */
const useClassifier = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const classify = useCallback(async (activity) => {
    try {
      setLoading(true);
      setError(null);
      const result = await classifyActivity(activity);
      return result;
    } catch (err) {
      console.error('Error classifying activity:', err);
      setError(err.message || 'Failed to classify activity');
      return { category: 'neutral', probabilities: {} };
    } finally {
      setLoading(false);
    }
  }, []);

  const train = useCallback(async (activities, categories) => {
    try {
      setLoading(true);
      setError(null);
      const result = await trainClassifier(activities, categories);
      return result;
    } catch (err) {
      console.error('Error training classifier:', err);
      setError(err.message || 'Failed to train classifier');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    classify,
    train,
    loading,
    error,
  };
};

export default useClassifier;