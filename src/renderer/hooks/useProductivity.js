import { useState, useCallback } from 'react';
import { predictProductivity, trainProductivityPredictor, generateRecommendations } from '../../shared/api';

/**
 * Hook for interacting with the productivity predictor and recommendation engine
 * @returns {Object} Productivity functions and state
 */
const useProductivity = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (activities) => {
    try {
      setLoading(true);
      setError(null);
      const result = await predictProductivity(activities);
      return result.score;
    } catch (err) {
      console.error('Error predicting productivity:', err);
      setError(err.message || 'Failed to predict productivity');
      return 50; // Default score
    } finally {
      setLoading(false);
    }
  }, []);

  const train = useCallback(async (activitiesList, scores) => {
    try {
      setLoading(true);
      setError(null);
      const result = await trainProductivityPredictor(activitiesList, scores);
      return result;
    } catch (err) {
      console.error('Error training productivity predictor:', err);
      setError(err.message || 'Failed to train productivity predictor');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (activities, maxRecommendations = 3) => {
    try {
      setLoading(true);
      setError(null);
      const result = await generateRecommendations(activities, maxRecommendations);
      return result.recommendations || [];
    } catch (err) {
      console.error('Error generating recommendations:', err);
      setError(err.message || 'Failed to generate recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    predict,
    train,
    getRecommendations,
    loading,
    error,
  };
};

export default useProductivity;