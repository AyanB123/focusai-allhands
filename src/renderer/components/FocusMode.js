import React, { useState, useEffect } from 'react';

const FocusMode = ({ toggleFocusMode }) => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(true);
  const [goal, setGoal] = useState('Complete focused work session');
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      // Timer completed
      setIsActive(false);
      // Play notification sound
      const audio = new Audio('path-to-notification-sound.mp3');
      audio.play();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);
  
  // Handle pause/resume
  const toggleTimer = () => {
    setIsActive(prev => !prev);
  };
  
  // Handle goal change
  const handleGoalChange = (e) => {
    setGoal(e.target.value);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-dark-card p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6">Focus Mode</h2>
        
        {/* Timer Display */}
        <div className="text-6xl font-bold text-center mb-8 text-accent-blue">
          {formatTime(timeRemaining)}
        </div>
        
        {/* Goal Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Current Goal:</label>
          <input
            type="text"
            value={goal}
            onChange={handleGoalChange}
            className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleTimer}
            className="px-6 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90"
          >
            {isActive ? 'Pause' : 'Resume'}
          </button>
          
          <button
            onClick={toggleFocusMode}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-opacity-90"
          >
            Exit Focus Mode
          </button>
        </div>
        
        {/* Tips */}
        <div className="mt-8 text-sm text-gray-400">
          <h3 className="font-medium mb-2">Focus Tips:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Close all distracting applications and notifications</li>
            <li>Stay focused on one task at a time</li>
            <li>Take a 5-minute break after this session</li>
            <li>Stay hydrated and maintain good posture</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;