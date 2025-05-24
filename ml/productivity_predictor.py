"""
Productivity Predictor

This module predicts productivity scores based on activity patterns.
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
import joblib

class ProductivityPredictor:
    """
    Predicts productivity scores based on activity patterns.
    """
    
    def __init__(self, model_path=None):
        """
        Initialize the predictor.
        
        Args:
            model_path (str, optional): Path to a saved model. If None, a new model will be created.
        """
        self.model_path = model_path or os.path.join(os.path.dirname(__file__), 'models', 'productivity_predictor.joblib')
        
        # Create a pipeline with StandardScaler and RandomForestRegressor
        self.pipeline = Pipeline([
            ('scaler', StandardScaler()),
            ('regressor', RandomForestRegressor(n_estimators=100, random_state=42))
        ])
        
        # Load the model if it exists
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
    
    def _extract_features(self, activities):
        """
        Extract features from activities.
        
        Args:
            activities (list): List of activity dictionaries.
            
        Returns:
            numpy.ndarray: Feature matrix.
        """
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        # Extract features
        features = []
        
        # Calculate time spent on each category
        category_times = df.groupby('category')['duration'].sum().to_dict()
        total_time = df['duration'].sum()
        
        # Normalize by total time
        for category in ['productive', 'neutral', 'distracting']:
            features.append(category_times.get(category, 0) / total_time if total_time > 0 else 0)
        
        # Calculate number of context switches
        context_switches = len(df) - 1 if len(df) > 0 else 0
        features.append(context_switches / (total_time / 3600) if total_time > 0 else 0)  # Switches per hour
        
        # Calculate average activity duration
        features.append(df['duration'].mean() if len(df) > 0 else 0)
        
        # Calculate standard deviation of activity duration
        features.append(df['duration'].std() if len(df) > 1 else 0)
        
        # Calculate time of day features (assuming activities have a 'timestamp' field)
        if 'timestamp' in df.columns:
            df['hour'] = pd.to_datetime(df['timestamp']).dt.hour
            morning_time = df[df['hour'].between(5, 11)]['duration'].sum()
            afternoon_time = df[df['hour'].between(12, 17)]['duration'].sum()
            evening_time = df[df['hour'].between(18, 23)]['duration'].sum()
            night_time = df[~df['hour'].between(5, 23)]['duration'].sum()
            
            features.extend([
                morning_time / total_time if total_time > 0 else 0,
                afternoon_time / total_time if total_time > 0 else 0,
                evening_time / total_time if total_time > 0 else 0,
                night_time / total_time if total_time > 0 else 0,
            ])
        else:
            features.extend([0, 0, 0, 0])
        
        return np.array(features).reshape(1, -1)
    
    def train(self, activities_list, productivity_scores):
        """
        Train the predictor on a set of activities.
        
        Args:
            activities_list (list): List of activity lists, where each inner list contains activity dictionaries.
            productivity_scores (list): List of productivity scores for each activity list.
            
        Returns:
            float: R^2 score of the model.
        """
        # Extract features from each activity list
        X = np.vstack([self._extract_features(activities) for activities in activities_list])
        y = np.array(productivity_scores)
        
        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Train the model
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate the model
        r2_score = self.pipeline.score(X_test, y_test)
        
        # Save the model
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.pipeline, self.model_path)
        
        return r2_score
    
    def predict(self, activities):
        """
        Predict the productivity score for a set of activities.
        
        Args:
            activities (list): List of activity dictionaries.
            
        Returns:
            float: Predicted productivity score (0-100).
        """
        if not os.path.exists(self.model_path):
            # If no model exists, return a default score based on the productive time percentage
            df = pd.DataFrame(activities)
            if len(df) == 0:
                return 50.0
            
            category_times = df.groupby('category')['duration'].sum().to_dict()
            total_time = df['duration'].sum()
            productive_ratio = category_times.get('productive', 0) / total_time if total_time > 0 else 0
            
            return productive_ratio * 100
        
        # Extract features
        X = self._extract_features(activities)
        
        # Predict the score
        score = self.pipeline.predict(X)[0]
        
        # Clip the score to the range [0, 100]
        return max(0, min(100, score))
    
    def save(self):
        """
        Save the model to disk.
        """
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        joblib.dump(self.pipeline, self.model_path)
    
    def load(self):
        """
        Load the model from disk.
        
        Returns:
            bool: True if the model was loaded successfully, False otherwise.
        """
        if os.path.exists(self.model_path):
            self.pipeline = joblib.load(self.model_path)
            return True
        return False


if __name__ == '__main__':
    # Example usage
    predictor = ProductivityPredictor()
    
    # Example activities
    activities_list = [
        [
            {'app': 'Visual Studio Code', 'title': 'index.js', 'category': 'productive', 'duration': 3600, 'timestamp': '2023-01-01T09:00:00Z'},
            {'app': 'Chrome', 'title': 'YouTube', 'category': 'distracting', 'duration': 1800, 'timestamp': '2023-01-01T10:00:00Z'},
            {'app': 'Slack', 'title': 'general', 'category': 'neutral', 'duration': 900, 'timestamp': '2023-01-01T10:30:00Z'},
        ],
        [
            {'app': 'Chrome', 'title': 'GitHub', 'category': 'productive', 'duration': 2700, 'timestamp': '2023-01-02T09:00:00Z'},
            {'app': 'Terminal', 'title': 'bash', 'category': 'productive', 'duration': 1800, 'timestamp': '2023-01-02T10:00:00Z'},
            {'app': 'Chrome', 'title': 'Facebook', 'category': 'distracting', 'duration': 900, 'timestamp': '2023-01-02T10:30:00Z'},
        ],
        [
            {'app': 'Chrome', 'title': 'Netflix', 'category': 'distracting', 'duration': 3600, 'timestamp': '2023-01-03T09:00:00Z'},
            {'app': 'Chrome', 'title': 'Twitter', 'category': 'distracting', 'duration': 1800, 'timestamp': '2023-01-03T10:00:00Z'},
            {'app': 'Chrome', 'title': 'Instagram', 'category': 'distracting', 'duration': 900, 'timestamp': '2023-01-03T10:30:00Z'},
        ],
    ]
    
    productivity_scores = [70, 85, 30]
    
    # Train the model
    r2_score = predictor.train(activities_list, productivity_scores)
    print(f'Model R^2 score: {r2_score:.2f}')
    
    # Make predictions
    for i, activities in enumerate(activities_list):
        score = predictor.predict(activities)
        print(f'Activities {i+1}:')
        print(f'Predicted productivity score: {score:.2f}')
        print(f'Actual productivity score: {productivity_scores[i]}')
        print()