/**
 * ML Bridge
 * 
 * This module provides a bridge between the Electron app and the Python ML server.
 */

const axios = require('axios');
const { spawn } = require('child_process');
const path = require('path');
const { app } = require('electron');

class MLBridge {
  constructor() {
    this.serverProcess = null;
    this.serverUrl = 'http://localhost:5000';
    this.isServerRunning = false;
    this.startupTimeout = null;
    this.maxStartupTime = 30000; // 30 seconds
  }

  /**
   * Start the ML server
   * @returns {Promise<boolean>} True if the server was started successfully
   */
  async startServer() {
    if (this.isServerRunning) {
      console.log('ML server is already running');
      return true;
    }

    return new Promise((resolve) => {
      try {
        const pythonPath = process.platform === 'win32' ? 'python' : 'python3';
        const serverPath = path.join(app.getAppPath(), 'ml', 'server.py');
        
        console.log(`Starting ML server from ${serverPath}`);
        
        this.serverProcess = spawn(pythonPath, [serverPath, '--host', '0.0.0.0']);
        
        this.serverProcess.stdout.on('data', (data) => {
          console.log(`ML server: ${data}`);
        });
        
        this.serverProcess.stderr.on('data', (data) => {
          console.error(`ML server error: ${data}`);
        });
        
        this.serverProcess.on('close', (code) => {
          console.log(`ML server process exited with code ${code}`);
          this.isServerRunning = false;
          this.serverProcess = null;
        });
        
        // Check if the server is running
        this.startupTimeout = setTimeout(() => {
          console.error('ML server failed to start within the timeout period');
          resolve(false);
        }, this.maxStartupTime);
        
        // Poll the server until it's ready
        const checkServer = () => {
          axios.get(`${this.serverUrl}/health`)
            .then(() => {
              clearTimeout(this.startupTimeout);
              this.isServerRunning = true;
              console.log('ML server is running');
              resolve(true);
            })
            .catch(() => {
              if (!this.isServerRunning) {
                setTimeout(checkServer, 1000);
              }
            });
        };
        
        checkServer();
      } catch (error) {
        console.error('Error starting ML server:', error);
        clearTimeout(this.startupTimeout);
        resolve(false);
      }
    });
  }

  /**
   * Stop the ML server
   */
  stopServer() {
    if (this.serverProcess) {
      console.log('Stopping ML server');
      this.serverProcess.kill();
      this.serverProcess = null;
      this.isServerRunning = false;
    }
  }

  /**
   * Classify an activity
   * @param {string} activity - The activity to classify
   * @returns {Promise<Object>} The classification result
   */
  async classifyActivity(activity) {
    if (!this.isServerRunning) {
      await this.startServer();
    }
    
    try {
      const response = await axios.post(`${this.serverUrl}/classify`, { activity });
      return response.data;
    } catch (error) {
      console.error('Error classifying activity:', error);
      throw error;
    }
  }

  /**
   * Train the classifier
   * @param {Array} activities - The activities to train on
   * @param {Array} categories - The categories for each activity
   * @returns {Promise<Object>} The training result
   */
  async trainClassifier(activities, categories) {
    if (!this.isServerRunning) {
      await this.startServer();
    }
    
    try {
      const response = await axios.post(`${this.serverUrl}/train`, { activities, categories });
      return response.data;
    } catch (error) {
      console.error('Error training classifier:', error);
      throw error;
    }
  }
  
  /**
   * Predict productivity score
   * @param {Array} activities - The activities to predict on
   * @returns {Promise<Object>} The prediction result
   */
  async predictProductivity(activities) {
    if (!this.isServerRunning) {
      await this.startServer();
    }
    
    try {
      const response = await axios.post(`${this.serverUrl}/predict-productivity`, { activities });
      return response.data;
    } catch (error) {
      console.error('Error predicting productivity:', error);
      throw error;
    }
  }
  
  /**
   * Train the productivity predictor
   * @param {Array} activitiesList - List of activity lists
   * @param {Array} scores - The productivity scores for each activity list
   * @returns {Promise<Object>} The training result
   */
  async trainProductivityPredictor(activitiesList, scores) {
    if (!this.isServerRunning) {
      await this.startServer();
    }
    
    try {
      const response = await axios.post(`${this.serverUrl}/train-predictor`, { 
        activities_list: activitiesList, 
        scores 
      });
      return response.data;
    } catch (error) {
      console.error('Error training productivity predictor:', error);
      throw error;
    }
  }
  
  /**
   * Generate productivity recommendations
   * @param {Array} activities - The activities to generate recommendations for
   * @param {number} maxRecommendations - Maximum number of recommendations to generate
   * @returns {Promise<Object>} The recommendations
   */
  async generateRecommendations(activities, maxRecommendations = 3) {
    if (!this.isServerRunning) {
      await this.startServer();
    }
    
    try {
      const response = await axios.post(`${this.serverUrl}/recommendations`, { 
        activities, 
        max_recommendations: maxRecommendations 
      });
      return response.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  }
}

module.exports = new MLBridge();