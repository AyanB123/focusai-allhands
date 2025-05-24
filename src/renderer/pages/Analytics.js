import React from 'react';

const Analytics = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      
      <div className="card mb-6">
        <h2 className="text-xl font-medium mb-4">Productivity Trends</h2>
        <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
          <div className="text-lg">Productivity Trend Chart</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Application Usage</h2>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-lg">Application Usage Chart</div>
          </div>
        </div>
        
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Time Distribution</h2>
          <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
            <div className="text-lg">Time Distribution Chart</div>
          </div>
        </div>
      </div>
      
      <div className="card mt-6">
        <h2 className="text-xl font-medium mb-4">Productivity Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Most Productive Day</div>
            <p className="text-gray-400">
              Tuesday is your most productive day, with an average productivity score of 82.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Most Productive Hours</div>
            <p className="text-gray-400">
              Your productivity peaks between 9 AM and 11 AM, with a secondary peak from 3 PM to 5 PM.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Top Distractions</div>
            <p className="text-gray-400">
              Social media (45 min/day), News websites (30 min/day), Video streaming (25 min/day)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;