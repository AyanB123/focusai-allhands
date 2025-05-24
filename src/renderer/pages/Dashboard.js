import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDailySummary } from '../store/activitiesSlice';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { activities, dailySummary, isTracking } = useSelector(state => state.activities);
  
  // Simulate fetching daily summary data
  useEffect(() => {
    // In a real app, this would come from the backend
    const mockSummary = {
      productive: 3.5, // hours
      neutral: 2.0,
      distracting: 1.0
    };
    
    dispatch(updateDailySummary(mockSummary));
  }, [dispatch]);
  
  // Calculate productivity score (simple version)
  const calculateProductivityScore = () => {
    const total = dailySummary.productive + dailySummary.neutral + dailySummary.distracting;
    if (total === 0) return 0;
    
    return Math.round((dailySummary.productive + (dailySummary.neutral * 0.5)) / total * 100);
  };
  
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3>Today's Overview</h3>
        <div className="date">{new Date().toLocaleDateString()}</div>
      </div>
      
      <div className="dashboard-cards">
        <div className="card productivity-score">
          <h4>Productivity Score</h4>
          <div className="score">{calculateProductivityScore()}%</div>
          <div className="status">{isTracking ? 'Currently tracking' : 'Tracking paused'}</div>
        </div>
        
        <div className="card time-distribution">
          <h4>Time Distribution</h4>
          <div className="time-categories">
            <div className="category">
              <div className="category-label">Productive</div>
              <div className="category-time">{dailySummary.productive} hrs</div>
              <div className="category-bar">
                <div 
                  className="bar productive" 
                  style={{ 
                    width: `${(dailySummary.productive / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="category">
              <div className="category-label">Neutral</div>
              <div className="category-time">{dailySummary.neutral} hrs</div>
              <div className="category-bar">
                <div 
                  className="bar neutral" 
                  style={{ 
                    width: `${(dailySummary.neutral / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="category">
              <div className="category-label">Distracting</div>
              <div className="category-time">{dailySummary.distracting} hrs</div>
              <div className="category-bar">
                <div 
                  className="bar distracting" 
                  style={{ 
                    width: `${(dailySummary.distracting / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="recent-activities">
        <h4>Recent Activities</h4>
        {activities.length > 0 ? (
          <div className="activities-list">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className={`activity-item ${activity.category}`}>
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-details">
                  <div className="activity-name">{activity.name}</div>
                  <div className="activity-time">{activity.duration}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activities">
            No activities recorded today. Start tracking to see your activities.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;