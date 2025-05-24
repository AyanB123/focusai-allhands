# Frontend Tasks

This document provides detailed specifications for all frontend tasks in the ProductivityPro project, organized by development phase.

## Component Overview

The frontend of ProductivityPro consists of the following main components:

- **Dashboard**: Activity Timeline, Focus Score, AI Suggestions widgets
- **Analytics**: Reports, filters, heatmaps, export functionality
- **Scheduler**: Calendar view, task list, predictive suggestions
- **Workflow**: Interactive graph, scenario simulator
- **Settings**: Tracking preferences, integrations, UI customization
- **Chat Widget**: Text/voice input, real-time responses
- **Focus Mode**: Timer, music player, app/website blocker
- **System Tray**: Pause/resume tracking, quick access menu

## Technology Stack

- **Framework**: React 18
- **UI Library**: Tailwind CSS 3
- **State Management**: Redux Toolkit
- **Charts**: Chart.js, D3.js
- **Animations**: Framer Motion
- **Testing**: Jest, React Testing Library
- **Desktop Integration**: Electron 25

## Phase 1: Core Tracking and Categorization

### T1.1: Build Dashboard UI with Timeline (16h)

**Description**: Create the main dashboard UI with an activity timeline that shows the user's app and website usage throughout the day.

**Component**: Dashboard

**Acceptance Criteria**:
- Activity timeline shows app/website usage with color-coded categories
- Time range selector (today, yesterday, this week)
- Tooltips show detailed information on hover
- Timeline updates automatically every 5 minutes

**Implementation Details**:
```jsx
// ActivityTimeline.jsx
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchActivityData } from '../api/activity';

const ActivityTimeline = ({ timeRange = 'today' }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const loadData = async () => {
      const activityData = await fetchActivityData(timeRange);
      setData(activityData);
    };
    
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, [timeRange]);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Activity Timeline</h2>
      <div className="flex mb-4">
        <button 
          className={`mr-2 px-3 py-1 rounded ${timeRange === 'today' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('today')}
        >
          Today
        </button>
        <button 
          className={`mr-2 px-3 py-1 rounded ${timeRange === 'yesterday' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('yesterday')}
        >
          Yesterday
        </button>
        <button 
          className={`px-3 py-1 rounded ${timeRange === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('week')}
        >
          This Week
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-gray-800 text-white p-2 rounded">
                    <p className="font-semibold">{data.app}</p>
                    <p>{data.time}</p>
                    <p>Duration: {data.duration}</p>
                    <p>Category: {data.category}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="duration" 
            fill={(entry) => getCategoryColor(entry.category)} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityTimeline;
```

**Branch**: `feature/t1.1-dashboard-timeline`

**Dependencies**: T1.7 (API Server)

### T1.2: Implement Daily Summary Widget (12h)

**Description**: Create a daily summary widget that shows the user's time distribution across categories and top apps/websites.

**Component**: Dashboard

**Acceptance Criteria**:
- Pie chart shows category breakdown
- Bar chart shows top 5 apps/websites
- Summary statistics (total tracked time, productive time, etc.)
- Auto-refresh every 5 minutes

**Implementation Details**:
```jsx
// DailySummary.jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchSummaryData } from '../api/activity';

const DailySummary = () => {
  const [data, setData] = useState({
    categories: [],
    topApps: [],
    stats: {
      totalTime: '0h 0m',
      productiveTime: '0h 0m',
      productivityScore: 0
    }
  });
  
  useEffect(() => {
    const loadData = async () => {
      const summaryData = await fetchSummaryData();
      setData(summaryData);
    };
    
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000); // Refresh every 5 minutes
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Daily Summary</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-md font-medium mb-2">Time Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data.categories}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getCategoryColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Top Apps</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.topApps}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="time" fill="#1E40AF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">Total Time</p>
          <p className="text-xl font-semibold">{data.stats.totalTime}</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">Productive Time</p>
          <p className="text-xl font-semibold">{data.stats.productiveTime}</p>
        </div>
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-600">Productivity Score</p>
          <p className="text-xl font-semibold">{data.stats.productivityScore}/100</p>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
```

**Branch**: `feature/t1.2-daily-summary`

**Dependencies**: T1.7 (API Server)

## Phase 2: Analytics and Basic AI

### T2.1: Build Analytics Screen with Reports (16h)

**Description**: Create the analytics screen with detailed reports, filters, and export functionality.

**Component**: Analytics

**Acceptance Criteria**:
- Daily, weekly, and monthly report views
- Filters for date range, categories, and apps
- Heatmap showing productivity patterns
- Export to CSV/PDF functionality

**Implementation Details**:
```jsx
// Analytics.jsx
import React, { useState, useEffect } from 'react';
import { fetchAnalyticsData, exportReport } from '../api/analytics';
import { DateRangePicker } from '../components/DateRangePicker';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductivityHeatmap } from '../components/ProductivityHeatmap';
import { ReportTable } from '../components/ReportTable';

const Analytics = () => {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const analyticsData = await fetchAnalyticsData(reportType, dateRange, categories);
        setData(analyticsData);
      } catch (error) {
        console.error('Failed to load analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [reportType, dateRange, categories]);
  
  const handleExport = async (format) => {
    try {
      await exportReport(reportType, dateRange, categories, format);
    } catch (error) {
      console.error(`Failed to export as ${format}:`, error);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap items-center justify-between mb-4">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button 
              className={`px-4 py-2 rounded ${reportType === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('daily')}
            >
              Daily
            </button>
            <button 
              className={`px-4 py-2 rounded ${reportType === 'weekly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('weekly')}
            >
              Weekly
            </button>
            <button 
              className={`px-4 py-2 rounded ${reportType === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => setReportType('monthly')}
            >
              Monthly
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => handleExport('csv')}
            >
              Export CSV
            </button>
            <button 
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={() => handleExport('pdf')}
            >
              Export PDF
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <CategoryFilter value={categories} onChange={setCategories} />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : data ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Productivity Patterns</h2>
            <ProductivityHeatmap data={data.heatmap} />
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Detailed Report</h2>
            <ReportTable data={data.details} />
          </div>
        </>
      ) : (
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <p>No data available for the selected filters.</p>
        </div>
      )}
    </div>
  );
};

export default Analytics;
```

**Branch**: `feature/t2.1-analytics-screen`

**Dependencies**: T2.7 (Analytics API)

## Phase 3: Advanced AI and Workflow

### T3.1: Create Workflow Screen with GNN Insights (20h)

**Description**: Build the workflow screen with an interactive graph visualization powered by the Graph Neural Network (GNN).

**Component**: Workflow

**Acceptance Criteria**:
- Interactive graph showing relationships between activities
- Node size represents time spent
- Edge thickness represents transition frequency
- Color coding by productivity impact
- Insights panel with GNN-based suggestions

**Implementation Details**:
```jsx
// Workflow.jsx
import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { fetchWorkflowData, fetchGnnInsights } from '../api/workflow';

const Workflow = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [insights, setInsights] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const workflowData = await fetchWorkflowData();
        setGraphData(workflowData);
        
        const gnnInsights = await fetchGnnInsights();
        setInsights(gnnInsights);
      } catch (error) {
        console.error('Failed to load workflow data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const handleNodeClick = async (node) => {
    setSelectedNode(node);
    try {
      const nodeInsights = await fetchGnnInsights(node.id);
      setInsights(nodeInsights);
    } catch (error) {
      console.error('Failed to load node insights:', error);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Workflow Insights</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Activity Workflow</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="h-96 border rounded">
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="name"
                nodeColor={node => getProductivityColor(node.productivity)}
                nodeRelSize={node => 5 + node.timeSpent / 10}
                linkWidth={link => 1 + link.frequency / 5}
                linkColor={() => "#999"}
                onNodeClick={handleNodeClick}
              />
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>High Productivity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Medium Productivity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Low Productivity</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>Distraction</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {selectedNode ? `Insights for ${selectedNode.name}` : 'Overall Workflow Insights'}
          </h2>
          
          {insights.length > 0 ? (
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">{insight.title}</p>
                  <p className="text-sm text-blue-600 mt-1">{insight.description}</p>
                  {insight.recommendation && (
                    <p className="text-sm font-medium text-blue-700 mt-2">
                      Recommendation: {insight.recommendation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No insights available.</p>
          )}
          
          {selectedNode && (
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <h3 className="font-medium">Activity Details</h3>
              <p className="text-sm mt-1">Name: {selectedNode.name}</p>
              <p className="text-sm">Category: {selectedNode.category}</p>
              <p className="text-sm">Time Spent: {formatTime(selectedNode.timeSpent)}</p>
              <p className="text-sm">Productivity Score: {selectedNode.productivity}/100</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Workflow;
```

**Branch**: `feature/t3.1-workflow-screen`

**Dependencies**: T3.8 (GNN Model), T3.11 (AI Endpoints)

## Phase 4: Polish, Testing, and Release

### T4.1: Add Drag-and-Drop Dashboard Widgets (12h)

**Description**: Enhance the dashboard with drag-and-drop functionality for widgets, allowing users to customize their dashboard layout.

**Component**: Dashboard

**Acceptance Criteria**:
- Widgets can be dragged and rearranged
- Layout is saved in user preferences
- Add/remove widgets functionality
- Responsive layout on different screen sizes

**Implementation Details**:
```jsx
// DashboardGrid.jsx
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { fetchDashboardLayout, saveDashboardLayout } from '../api/settings';
import ActivityTimeline from './ActivityTimeline';
import DailySummary from './DailySummary';
import FocusScore from './FocusScore';
import AiSuggestions from './AiSuggestions';
import QuickActions from './QuickActions';

const ResponsiveGridLayout = WidthProvider(Responsive);

const widgetComponents = {
  activityTimeline: ActivityTimeline,
  dailySummary: DailySummary,
  focusScore: FocusScore,
  aiSuggestions: AiSuggestions,
  quickActions: QuickActions
};

const DashboardGrid = () => {
  const [layouts, setLayouts] = useState({
    lg: [
      { i: 'activityTimeline', x: 0, y: 0, w: 8, h: 4 },
      { i: 'dailySummary', x: 8, y: 0, w: 4, h: 4 },
      { i: 'focusScore', x: 0, y: 4, w: 4, h: 3 },
      { i: 'aiSuggestions', x: 4, y: 4, w: 4, h: 3 },
      { i: 'quickActions', x: 8, y: 4, w: 4, h: 3 }
    ]
  });
  const [availableWidgets, setAvailableWidgets] = useState(Object.keys(widgetComponents));
  const [activeWidgets, setActiveWidgets] = useState(Object.keys(widgetComponents));
  
  useEffect(() => {
    const loadLayout = async () => {
      try {
        const savedLayout = await fetchDashboardLayout();
        if (savedLayout) {
          setLayouts(savedLayout.layouts);
          setActiveWidgets(savedLayout.activeWidgets);
        }
      } catch (error) {
        console.error('Failed to load dashboard layout:', error);
      }
    };
    
    loadLayout();
  }, []);
  
  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts(allLayouts);
    saveDashboardLayout({ layouts: allLayouts, activeWidgets });
  };
  
  const handleAddWidget = (widgetId) => {
    if (!activeWidgets.includes(widgetId)) {
      const newActiveWidgets = [...activeWidgets, widgetId];
      setActiveWidgets(newActiveWidgets);
      saveDashboardLayout({ layouts, activeWidgets: newActiveWidgets });
    }
  };
  
  const handleRemoveWidget = (widgetId) => {
    const newActiveWidgets = activeWidgets.filter(id => id !== widgetId);
    setActiveWidgets(newActiveWidgets);
    saveDashboardLayout({ layouts, activeWidgets: newActiveWidgets });
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="relative">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">
            Add Widget
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 hidden group-hover:block">
            {availableWidgets
              .filter(widget => !activeWidgets.includes(widget))
              .map(widget => (
                <button
                  key={widget}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAddWidget(widget)}
                >
                  {widgetDisplayName(widget)}
                </button>
              ))}
          </div>
        </div>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={100}
        onLayoutChange={handleLayoutChange}
        isDraggable
        isResizable
      >
        {activeWidgets.map(widgetId => {
          const WidgetComponent = widgetComponents[widgetId];
          return (
            <div key={widgetId} className="bg-white rounded-lg shadow">
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-semibold">{widgetDisplayName(widgetId)}</h2>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleRemoveWidget(widgetId)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <WidgetComponent />
              </div>
            </div>
          );
        })}
      </ResponsiveGridLayout>
    </div>
  );
};

const widgetDisplayName = (widgetId) => {
  const names = {
    activityTimeline: 'Activity Timeline',
    dailySummary: 'Daily Summary',
    focusScore: 'Focus Score',
    aiSuggestions: 'AI Suggestions',
    quickActions: 'Quick Actions'
  };
  return names[widgetId] || widgetId;
};

export default DashboardGrid;
```

**Branch**: `feature/t4.1-dashboard-widgets`

**Dependencies**: T1.1, T1.2 (Dashboard components)