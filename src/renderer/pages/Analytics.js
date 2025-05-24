import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/Analytics.css';

const Analytics = () => {
  const { activities, dailySummary } = useSelector(state => state.activities);
  const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month'
  
  // Mock data for charts - in a real app, this would be calculated from actual data
  const productivityData = {
    day: [65, 70, 60, 75, 80, 75, 70, 65, 60, 55, 60, 65],
    week: [60, 65, 70, 75, 70, 65, 60],
    month: [55, 60, 65, 70, 75, 70, 65, 60, 65, 70, 75, 80, 75, 70, 65, 60, 65, 70, 75, 80, 75, 70, 65, 60, 65, 70, 75, 80, 75, 70]
  };
  
  // Get labels for the chart based on time range
  const getLabels = () => {
    if (timeRange === 'day') {
      return Array.from({ length: 12 }, (_, i) => `${i * 2}:00`);
    } else if (timeRange === 'week') {
      return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else {
      return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
    }
  };
  
  // Calculate top applications
  const getTopApplications = () => {
    const appCounts = {};
    activities.forEach(activity => {
      if (!appCounts[activity.name]) {
        appCounts[activity.name] = 0;
      }
      // Convert duration string to minutes for calculation
      const durationParts = activity.duration.split(':');
      const minutes = parseInt(durationParts[0]) * 60 + parseInt(durationParts[1]);
      appCounts[activity.name] += minutes;
    });
    
    // Convert to array and sort
    return Object.entries(appCounts)
      .map(([name, minutes]) => ({
        name,
        time: `${Math.floor(minutes / 60)}h ${minutes % 60}m`,
        minutes
      }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 5);
  };
  
  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h3>Productivity Analytics</h3>
        
        <div className="time-range-selector">
          <button 
            className={`range-btn ${timeRange === 'day' ? 'active' : ''}`}
            onClick={() => setTimeRange('day')}
          >
            Day
          </button>
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>
      
      <div className="analytics-content">
        <div className="chart-container">
          <h4>Productivity Score Trend</h4>
          <div className="productivity-chart">
            {/* In a real app, we would use a charting library like Chart.js or Recharts */}
            <div className="chart-placeholder">
              <div className="chart-bars">
                {productivityData[timeRange].map((value, index) => (
                  <div key={index} className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ height: `${value}%` }}
                    ></div>
                    <div className="chart-label">{getLabels()[index]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="analytics-cards">
          <div className="analytics-card">
            <h4>Time Distribution</h4>
            <div className="pie-chart-placeholder">
              {/* In a real app, we would use a charting library */}
              <div className="pie-segments">
                <div className="pie-segment productive" style={{ transform: 'rotate(0deg)', clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(dailySummary.productive * Math.PI / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting))}% ${50 - 50 * Math.sin(dailySummary.productive * Math.PI / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting))}%)` }}></div>
                <div className="pie-segment neutral" style={{ transform: `rotate(${dailySummary.productive * 360 / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting)}deg)`, clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos(dailySummary.neutral * Math.PI / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting))}% ${50 - 50 * Math.sin(dailySummary.neutral * Math.PI / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting))}%)` }}></div>
                <div className="pie-segment distracting" style={{ transform: `rotate(${(dailySummary.productive + dailySummary.neutral) * 360 / (dailySummary.productive + dailySummary.neutral + dailySummary.distracting)}deg)`, clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)' }}></div>
              </div>
            </div>
            <div className="pie-legend">
              <div className="legend-item">
                <div className="color-box productive"></div>
                <div className="legend-label">Productive</div>
                <div className="legend-value">{dailySummary.productive}h</div>
              </div>
              <div className="legend-item">
                <div className="color-box neutral"></div>
                <div className="legend-label">Neutral</div>
                <div className="legend-value">{dailySummary.neutral}h</div>
              </div>
              <div className="legend-item">
                <div className="color-box distracting"></div>
                <div className="legend-label">Distracting</div>
                <div className="legend-value">{dailySummary.distracting}h</div>
              </div>
            </div>
          </div>
          
          <div className="analytics-card">
            <h4>Top Applications</h4>
            <div className="top-apps">
              {getTopApplications().length > 0 ? (
                getTopApplications().map((app, index) => (
                  <div key={index} className="app-item">
                    <div className="app-rank">{index + 1}</div>
                    <div className="app-name">{app.name}</div>
                    <div className="app-time">{app.time}</div>
                  </div>
                ))
              ) : (
                <div className="no-data">No application data available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;