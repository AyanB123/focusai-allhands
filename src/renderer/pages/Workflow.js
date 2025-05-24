import React, { useState } from 'react';

const Workflow = () => {
  const [workflows, setWorkflows] = useState([
    { 
      id: 1, 
      name: 'Deep Work Session', 
      steps: [
        { id: 1, description: 'Close all distracting applications', completed: false },
        { id: 2, description: 'Set timer for 90 minutes', completed: false },
        { id: 3, description: 'Focus on single task without interruption', completed: false },
        { id: 4, description: 'Take a 15-minute break', completed: false },
      ],
      active: false,
    },
    { 
      id: 2, 
      name: 'Morning Routine', 
      steps: [
        { id: 1, description: 'Review calendar for the day', completed: false },
        { id: 2, description: 'Check and respond to important emails', completed: false },
        { id: 3, description: 'Plan top 3 priorities for the day', completed: false },
        { id: 4, description: 'Start first deep work session', completed: false },
      ],
      active: false,
    },
  ]);
  
  const [newWorkflow, setNewWorkflow] = useState({
    name: '',
    steps: [{ id: Date.now(), description: '', completed: false }],
  });
  
  // Handle input change for new workflow
  const handleWorkflowNameChange = (e) => {
    setNewWorkflow(prev => ({ ...prev, name: e.target.value }));
  };
  
  // Handle step description change
  const handleStepChange = (id, value) => {
    setNewWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === id ? { ...step, description: value } : step
      ),
    }));
  };
  
  // Add new step to workflow
  const addStep = () => {
    setNewWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, { id: Date.now(), description: '', completed: false }],
    }));
  };
  
  // Remove step from workflow
  const removeStep = (id) => {
    setNewWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== id),
    }));
  };
  
  // Create new workflow
  const createWorkflow = (e) => {
    e.preventDefault();
    
    if (newWorkflow.name.trim() === '') return;
    if (newWorkflow.steps.some(step => step.description.trim() === '')) return;
    
    const workflow = {
      id: Date.now(),
      name: newWorkflow.name,
      steps: newWorkflow.steps,
      active: false,
    };
    
    setWorkflows(prev => [...prev, workflow]);
    setNewWorkflow({
      name: '',
      steps: [{ id: Date.now(), description: '', completed: false }],
    });
  };
  
  // Start workflow
  const startWorkflow = (id) => {
    setWorkflows(prev => 
      prev.map(workflow => ({
        ...workflow,
        active: workflow.id === id,
        steps: workflow.id === id 
          ? workflow.steps.map(step => ({ ...step, completed: false }))
          : workflow.steps,
      }))
    );
  };
  
  // Toggle step completion
  const toggleStep = (workflowId, stepId) => {
    setWorkflows(prev => 
      prev.map(workflow => 
        workflow.id === workflowId 
          ? {
              ...workflow,
              steps: workflow.steps.map(step => 
                step.id === stepId 
                  ? { ...step, completed: !step.completed } 
                  : step
              ),
            } 
          : workflow
      )
    );
  };
  
  // Delete workflow
  const deleteWorkflow = (id) => {
    setWorkflows(prev => prev.filter(workflow => workflow.id !== id));
  };
  
  // Get active workflow
  const activeWorkflow = workflows.find(workflow => workflow.active);
  
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Workflow Manager</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Workflow */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Active Workflow</h2>
          
          {activeWorkflow ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">{activeWorkflow.name}</h3>
                <button
                  onClick={() => startWorkflow(null)}
                  className="px-4 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-opacity-90"
                >
                  End Workflow
                </button>
              </div>
              
              <div className="space-y-3">
                {activeWorkflow.steps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className="flex items-center p-3 bg-gray-800 rounded-lg"
                  >
                    <div className="mr-3 text-lg font-medium">{index + 1}.</div>
                    <div className="flex-1">
                      <div className={`${step.completed ? 'line-through text-gray-500' : ''}`}>
                        {step.description}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => toggleStep(activeWorkflow.id, step.id)}
                      className="w-5 h-5 accent-accent-blue"
                    />
                  </div>
                ))}
              </div>
              
              {/* Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <div>Progress</div>
                  <div>
                    {activeWorkflow.steps.filter(step => step.completed).length} / {activeWorkflow.steps.length}
                  </div>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-accent-blue h-2.5 rounded-full" 
                    style={{ 
                      width: `${(activeWorkflow.steps.filter(step => step.completed).length / activeWorkflow.steps.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <p className="mb-4">No active workflow</p>
              <p>Select a workflow from the list to start</p>
            </div>
          )}
        </div>
        
        {/* Create Workflow */}
        <div className="card">
          <h2 className="text-xl font-medium mb-4">Create Workflow</h2>
          
          <form onSubmit={createWorkflow}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Workflow Name</label>
              <input
                type="text"
                value={newWorkflow.name}
                onChange={handleWorkflowNameChange}
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
                placeholder="Enter workflow name"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Steps</label>
              
              <div className="space-y-3">
                {newWorkflow.steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className="mr-2 text-sm">{index + 1}.</div>
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) => handleStepChange(step.id, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
                      placeholder="Enter step description"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeStep(step.id)}
                      className="ml-2 p-2 text-red-500 hover:text-red-400"
                      disabled={newWorkflow.steps.length === 1}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addStep}
                className="mt-3 px-4 py-1 bg-gray-700 text-white rounded-md text-sm hover:bg-opacity-90"
              >
                + Add Step
              </button>
            </div>
            
            <button
              type="submit"
              className="px-6 py-2 bg-accent-blue text-white rounded-md hover:bg-opacity-90"
            >
              Create Workflow
            </button>
          </form>
        </div>
      </div>
      
      {/* Workflow List */}
      <div className="card mt-6">
        <h2 className="text-xl font-medium mb-4">My Workflows</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map(workflow => (
            <div 
              key={workflow.id} 
              className={`p-4 rounded-lg border ${
                workflow.active 
                  ? 'border-accent-blue bg-accent-blue bg-opacity-10' 
                  : 'border-gray-700 bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium">{workflow.name}</h3>
                <button
                  onClick={() => deleteWorkflow(workflow.id)}
                  className="text-red-500 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
              
              <div className="text-sm text-gray-400 mb-3">
                {workflow.steps.length} steps
              </div>
              
              <button
                onClick={() => startWorkflow(workflow.id)}
                className={`w-full px-4 py-2 rounded-md text-white ${
                  workflow.active 
                    ? 'bg-green-600 hover:bg-opacity-90' 
                    : 'bg-accent-blue hover:bg-opacity-90'
                }`}
              >
                {workflow.active ? 'In Progress' : 'Start Workflow'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Workflow;