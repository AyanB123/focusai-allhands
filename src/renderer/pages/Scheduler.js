import React, { useState } from 'react';

const Scheduler = () => {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete project proposal', priority: 'high', status: 'in-progress', dueDate: '2025-05-25' },
    { id: 2, title: 'Review code changes', priority: 'medium', status: 'pending', dueDate: '2025-05-24' },
    { id: 3, title: 'Team meeting', priority: 'high', status: 'pending', dueDate: '2025-05-23' },
    { id: 4, title: 'Update documentation', priority: 'low', status: 'completed', dueDate: '2025-05-22' },
  ]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    priority: 'medium',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
  });
  
  // Handle input change for new task
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle task creation
  const handleCreateTask = (e) => {
    e.preventDefault();
    
    if (newTask.title.trim() === '') return;
    
    const task = {
      id: Date.now(),
      ...newTask,
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask({
      title: '',
      priority: 'medium',
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
    });
  };
  
  // Handle task status change
  const handleStatusChange = (id, status) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, status } : task
      )
    );
  };
  
  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-400';
    }
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Task Scheduler</h1>
      
      {/* Create Task Form */}
      <div className="card mb-6">
        <h2 className="text-xl font-medium mb-4">Create New Task</h2>
        <form onSubmit={handleCreateTask}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Task Title</label>
              <input
                type="text"
                name="title"
                value={newTask.title}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Enter task title"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={newTask.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                name="priority"
                value={newTask.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                name="status"
                value={newTask.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90"
          >
            Create Task
          </button>
        </form>
      </div>
      
      {/* Task List */}
      <div className="card">
        <h2 className="text-xl font-medium mb-4">Tasks</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-2 text-left">Task</th>
                <th className="py-2 text-left">Priority</th>
                <th className="py-2 text-left">Due Date</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="border-b border-gray-700">
                  <td className="py-3">{task.title}</td>
                  <td className={`py-3 ${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </td>
                  <td className="py-3">{task.dueDate}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      task.status === 'completed' 
                        ? 'bg-green-900 text-green-300' 
                        : task.status === 'in-progress' 
                          ? 'bg-blue-900 text-blue-300' 
                          : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {task.status.split('-').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex space-x-2">
                      {task.status !== 'in-progress' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                          className="px-2 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-opacity-90"
                        >
                          Start
                        </button>
                      )}
                      
                      {task.status !== 'completed' && (
                        <button
                          onClick={() => handleStatusChange(task.id, 'completed')}
                          className="px-2 py-1 bg-green-600 text-white rounded-md text-xs hover:bg-opacity-90"
                        >
                          Complete
                        </button>
                      )}
                      
                      <button
                        onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))}
                        className="px-2 py-1 bg-red-600 text-white rounded-md text-xs hover:bg-opacity-90"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* AI Recommendations */}
      <div className="card mt-6">
        <h2 className="text-xl font-medium mb-4">AI Task Recommendations</h2>
        <div className="p-4 bg-gray-800 rounded-lg">
          <p className="text-gray-400">
            Based on your productivity patterns and current workload, here are some recommendations:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
            <li>Schedule "Complete project proposal" for tomorrow morning between 9 AM and 11 AM when your focus is highest</li>
            <li>Break down "Update documentation" into smaller, more manageable tasks</li>
            <li>Consider delegating "Review code changes" to maximize your productivity</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Scheduler;