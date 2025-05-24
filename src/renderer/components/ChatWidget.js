import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = ({ toggleChat }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your ProductivityPro AI assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI response (would connect to actual AI service in production)
    setTimeout(() => {
      const aiResponses = [
        "I've analyzed your recent activity patterns. Would you like some suggestions to improve your focus?",
        "Based on your calendar, you have a meeting in 30 minutes. Would you like me to prepare a summary of related documents?",
        "I notice you've been working for 2 hours straight. Consider taking a short break to maintain productivity.",
        "Your most productive hours appear to be in the morning. Would you like me to schedule your most important tasks during that time?",
        "I've detected a potential distraction pattern when you switch to social media. Would you like me to help minimize these interruptions?"
      ];
      
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      
      const aiMessage = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'ai'
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };
  
  return (
    <div className="fixed right-4 bottom-4 w-80 h-96 bg-dark-card rounded-lg shadow-lg flex flex-col overflow-hidden z-50">
      {/* Chat Header */}
      <div className="p-4 bg-accent-blue text-white flex justify-between items-center">
        <h3 className="font-medium">AI Assistant</h3>
        <button 
          onClick={toggleChat}
          className="p-1 rounded-full hover:bg-opacity-20 hover:bg-white"
        >
          ✕
        </button>
      </div>
      
      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div 
              className={`inline-block p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-accent-blue text-white rounded-br-none' 
                  : 'bg-gray-700 text-white rounded-bl-none'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-l-md bg-gray-800 text-white border-gray-700 border focus:outline-none focus:ring-2 focus:ring-accent-blue"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-accent-blue text-white rounded-r-md hover:bg-opacity-90"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;