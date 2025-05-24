import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import '../styles/Activities.css';

const Activities = () => {
  const { activities, categories } = useSelector(state => state.activities);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState('all');
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  // Filter activities based on selected filter
  const getFilteredActivities = () => {
    if (filter === 'all') return activities;
    
    return activities.filter(activity => {
      if (filter === 'productive') {
        return categories.productive.includes(activity.type);
      } else if (filter === 'neutral') {
        return categories.neutral.includes(activity.type);
      } else if (filter === 'distracting') {
        return categories.distracting.includes(activity.type);
      }
      return true;
    });
  };
  
  // Group activities by hour
  const groupActivitiesByHour = () => {
    const groupedActivities = {};
    
    getFilteredActivities().forEach(activity => {
      const hour = new Date(activity.startTime).getHours();
      if (!groupedActivities[hour]) {
        groupedActivities[hour] = [];
      }
      groupedActivities[hour].push(activity);
    });
    
    return groupedActivities;
  };
  
  // Format hour for display
  const formatHour = (hour) => {
    return `${hour % 12 === 0 ? 12 : hour % 12}${hour < 12 ? 'am' : 'pm'}`;
  };
  
  return (
    <div className="activities-page">
      <div className="activities-header">
        <div className="date-selector">
          <button 
            className="date-nav prev"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
            }}
          >
            &lt;
          </button>
          <div className="selected-date">{formatDate(selectedDate)}</div>
          <button 
            className="date-nav next"
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
            }}
          >
            &gt;
          </button>
        </div>
        
        <div className="activity-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'productive' ? 'active' : ''}`}
            onClick={() => setFilter('productive')}
          >
            Productive
          </button>
          <button 
            className={`filter-btn ${filter === 'neutral' ? 'active' : ''}`}
            onClick={() => setFilter('neutral')}
          >
            Neutral
          </button>
          <button 
            className={`filter-btn ${filter === 'distracting' ? 'active' : ''}`}
            onClick={() => setFilter('distracting')}
          >
            Distracting
          </button>
        </div>
      </div>
      
      <div className="activities-timeline">
        {activities.length > 0 ? (
          Object.entries(groupActivitiesByHour()).map(([hour, hourActivities]) => (
            <div key={hour} className="timeline-hour">
              <div className="hour-label">{formatHour(parseInt(hour))}</div>
              <div className="hour-activities">
                {hourActivities.map((activity, index) => (
                  <div key={index} className={`timeline-activity ${activity.category}`}>
                    <div className="activity-time">
                      {new Date(activity.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {' - '}
                      {new Date(activity.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="activity-name">{activity.name}</div>
                    <div className="activity-duration">{activity.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="no-activities">
            No activities recorded for this day.
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;