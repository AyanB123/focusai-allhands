import React, { useContext } from 'react';
import { ActivityContext } from '../context/ActivityContext';

// Placeholder for chart components (would use actual chart libraries in production)
const ProductivityChart = ({ data }) => (
  <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="text-lg font-medium">Productivity Chart</div>
      <div className="text-sm text-gray-400">Productive: {data.productive}%</div>
      <div className="text-sm text-gray-400">Neutral: {data.neutral}%</div>
      <div className="text-sm text-gray-400">Distracting: {data.distracting}%</div>
    </div>
  </div>
);

const TimelineChart = () => (
  <div className="h-48 bg-gray-800 rounded-lg flex items-center justify-center">
    <div className="text-lg font-medium">Daily Timeline</div>
  </div>
);

const Dashboard = ({ toggleChat }) => {
  const { activities, stats } = useContext(ActivityContext);
  
  // Calculate percentages for the chart
  const total = stats.productive + stats.neutral + stats.distracting || 1; // Avoid division by zero
  const chartData = {
    productive: Math.round((stats.productive / total) * 100),
    neutral: Math.round((stats.neutral / total) * 100),
    distracting: Math.round((stats.distracting / total) * 100),
  };
  
  // Get recent activities (last 5)
  const recentActivities = activities.slice(-5).reverse();
  
  // Calculate productivity score (0-100)
  const productivityScore = Math.round(
    (stats.productive * 100 + stats.neutral * 50) / (total * 100) * 100
  );
  
  // Get productivity status based on score
  const getProductivityStatus = (score) => {
    if (score >= 80) return { text: 'Excellent', color: 'text-green-500' };
    if (score >= 60) return { text: 'Good', color: 'text-blue-500' };
    if (score >= 40) return { text: 'Average', color: 'text-yellow-500' };
    return { text: 'Needs Improvement', color: 'text-red-500' };
  };
  
  const status = getProductivityStatus(productivityScore);
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Productivity Score */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Productivity Score</h3>
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-4">{productivityScore}</div>
            <div className={`text-lg ${status.color}`}>{status.text}</div>
          </div>
        </div>
        
        {/* Focus Time */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Focus Time Today</h3>
          <div className="text-4xl font-bold">2h 15m</div>
          <div className="text-sm text-gray-400">Goal: 4 hours</div>
        </div>
        
        {/* Distractions */}
        <div className="card">
          <h3 className="text-lg font-medium mb-2">Distractions</h3>
          <div className="text-4xl font-bold">{stats.distracting}</div>
          <div className="text-sm text-gray-400">
            {stats.distracting > 10 ? 'High' : 'Low'} distraction level
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Productivity Breakdown</h3>
          <ProductivityChart data={chartData} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-medium mb-4">Daily Timeline</h3>
          <TimelineChart />
        </div>
      </div>
      
      {/* Recent Activities */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Recent Activities</h3>
          <button 
            onClick={() => toggleChat()}
            className="px-4 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90"
          >
            Ask AI Assistant
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left">Application</th>
                <th className="py-2 text-left">Category</th>
                <th className="py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentActivities.length > 0 ? (
                recentActivities.map((activity, index) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-3">{activity.name}</td>
                    <td className={`py-3 ${
                      activity.category === 'productive' 
                        ? 'text-green-500' 
                        : activity.category === 'distracting' 
                          ? 'text-red-500' 
                          : 'text-gray-400'
                    }`}>
                      {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                    </td>
                    <td className="py-3">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-4 text-center text-gray-400">
                    No activities recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Suggestions */}
      <div className="card mt-6">
        <h3 className="text-lg font-medium mb-4">AI Suggestions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Optimize Your Schedule</div>
            <p className="text-gray-400">
              Based on your productivity patterns, consider scheduling important tasks between 9 AM and 11 AM when your focus is highest.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Reduce Distractions</div>
            <p className="text-gray-400">
              You spend an average of 45 minutes on social media during work hours. Try using Focus Mode to minimize these interruptions.
            </p>
          </div>
          
          <div className="p-4 bg-gray-800 rounded-lg">
            <div className="font-medium mb-2">Take Regular Breaks</div>
            <p className="text-gray-400">
              You've been working for extended periods without breaks. Consider implementing the Pomodoro technique (25 min work, 5 min break).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;