"""
Recommendation Engine

This module generates productivity improvement recommendations based on activity patterns.
"""

import os
import json
import numpy as np
import pandas as pd
from collections import defaultdict

class RecommendationEngine:
    """
    Generates productivity improvement recommendations based on activity patterns.
    """
    
    def __init__(self):
        """
        Initialize the recommendation engine.
        """
        self.recommendation_templates = {
            'distracting_apps': [
                "Consider limiting your time on {app} to improve productivity.",
                "You spent {duration} minutes on {app} today. Try to reduce this time tomorrow.",
                "High usage of {app} detected. Consider using app blockers during work hours.",
            ],
            'context_switching': [
                "You switched between applications {count} times in {duration} hours. Try to reduce context switching.",
                "Consider time-blocking your day to reduce the {count} context switches observed.",
                "High context switching detected ({count} switches). Try the Pomodoro technique to stay focused.",
            ],
            'work_hours': [
                "Your most productive hours appear to be between {start_hour} and {end_hour}. Consider scheduling important tasks during this time.",
                "You might want to avoid working during {start_hour} to {end_hour}, as this appears to be your least productive time.",
                "Consider taking a break between {start_hour} and {end_hour} to recharge.",
            ],
            'breaks': [
                "You've been working for {duration} minutes without a break. Consider taking short breaks every 90 minutes.",
                "No breaks detected in your {duration}-minute work session. Try the 52/17 rule: 52 minutes of work followed by 17 minutes of rest.",
                "Regular breaks improve productivity. Try scheduling 5-minute breaks every hour.",
            ],
            'productive_apps': [
                "You're most productive when using {app}. Consider maximizing your time with this application.",
                "Great job spending {duration} minutes on {app} today!",
                "{app} seems to be your most productive application. Try to increase usage during your peak productivity hours.",
            ],
        }
    
    def _analyze_distracting_apps(self, activities, threshold_minutes=30):
        """
        Analyze distracting app usage.
        
        Args:
            activities (list): List of activity dictionaries.
            threshold_minutes (int): Threshold in minutes for considering an app as distracting.
            
        Returns:
            list: List of recommendations.
        """
        recommendations = []
        
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        if len(df) == 0 or 'category' not in df.columns:
            return recommendations
        
        # Filter distracting activities
        distracting_df = df[df['category'] == 'distracting']
        
        if len(distracting_df) == 0:
            return recommendations
        
        # Group by app and calculate total duration
        app_durations = distracting_df.groupby('app')['duration'].sum().reset_index()
        
        # Convert seconds to minutes
        app_durations['minutes'] = app_durations['duration'] / 60
        
        # Filter apps with duration above threshold
        distracting_apps = app_durations[app_durations['minutes'] > threshold_minutes]
        
        # Generate recommendations
        for _, row in distracting_apps.iterrows():
            app = row['app']
            duration = int(row['minutes'])
            
            # Select a random template
            template = np.random.choice(self.recommendation_templates['distracting_apps'])
            
            # Format the template
            recommendation = template.format(app=app, duration=duration)
            
            recommendations.append({
                'type': 'distracting_apps',
                'app': app,
                'duration': duration,
                'recommendation': recommendation,
            })
        
        return recommendations
    
    def _analyze_context_switching(self, activities, threshold_per_hour=10):
        """
        Analyze context switching.
        
        Args:
            activities (list): List of activity dictionaries.
            threshold_per_hour (int): Threshold for context switches per hour.
            
        Returns:
            list: List of recommendations.
        """
        recommendations = []
        
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        if len(df) <= 1 or 'timestamp' not in df.columns:
            return recommendations
        
        # Sort by timestamp
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df = df.sort_values('timestamp')
        
        # Calculate total duration in hours
        if len(df) >= 2:
            total_duration_hours = (df['timestamp'].max() - df['timestamp'].min()).total_seconds() / 3600
        else:
            total_duration_hours = df['duration'].sum() / 3600
        
        if total_duration_hours < 0.5:  # Less than 30 minutes
            return recommendations
        
        # Count context switches (app changes)
        context_switches = sum(df['app'].iloc[i] != df['app'].iloc[i-1] for i in range(1, len(df)))
        
        # Calculate switches per hour
        switches_per_hour = context_switches / total_duration_hours
        
        if switches_per_hour > threshold_per_hour:
            # Select a random template
            template = np.random.choice(self.recommendation_templates['context_switching'])
            
            # Format the template
            recommendation = template.format(
                count=context_switches,
                duration=round(total_duration_hours, 1)
            )
            
            recommendations.append({
                'type': 'context_switching',
                'count': context_switches,
                'duration_hours': round(total_duration_hours, 1),
                'recommendation': recommendation,
            })
        
        return recommendations
    
    def _analyze_work_hours(self, activities):
        """
        Analyze productive and unproductive hours.
        
        Args:
            activities (list): List of activity dictionaries.
            
        Returns:
            list: List of recommendations.
        """
        recommendations = []
        
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        if len(df) == 0 or 'timestamp' not in df.columns or 'category' not in df.columns:
            return recommendations
        
        # Convert timestamp to datetime and extract hour
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        df['hour'] = df['timestamp'].dt.hour
        
        # Group by hour and category, and calculate total duration
        hourly_productivity = df.groupby(['hour', 'category'])['duration'].sum().unstack(fill_value=0)
        
        if 'productive' not in hourly_productivity.columns:
            return recommendations
        
        # Calculate productivity ratio for each hour
        hourly_productivity['total'] = hourly_productivity.sum(axis=1)
        hourly_productivity['productivity_ratio'] = hourly_productivity['productive'] / hourly_productivity['total']
        
        # Filter hours with significant activity (at least 15 minutes)
        significant_hours = hourly_productivity[hourly_productivity['total'] >= 900]
        
        if len(significant_hours) == 0:
            return recommendations
        
        # Find most productive hours (top 25%)
        productive_hours = significant_hours.nlargest(max(1, len(significant_hours) // 4), 'productivity_ratio')
        
        if len(productive_hours) > 0:
            # Find consecutive productive hours
            productive_hour_indices = productive_hours.index.tolist()
            productive_hour_indices.sort()
            
            # Find the longest sequence of consecutive hours
            sequences = []
            current_sequence = [productive_hour_indices[0]]
            
            for i in range(1, len(productive_hour_indices)):
                if productive_hour_indices[i] == productive_hour_indices[i-1] + 1:
                    current_sequence.append(productive_hour_indices[i])
                else:
                    sequences.append(current_sequence)
                    current_sequence = [productive_hour_indices[i]]
            
            sequences.append(current_sequence)
            
            # Find the longest sequence
            longest_sequence = max(sequences, key=len)
            
            if len(longest_sequence) > 0:
                start_hour = longest_sequence[0]
                end_hour = longest_sequence[-1] + 1  # Add 1 to include the end hour
                
                # Format hours in 12-hour format
                start_hour_fmt = f"{start_hour if start_hour <= 12 else start_hour - 12}{' AM' if start_hour < 12 else ' PM'}"
                end_hour_fmt = f"{end_hour if end_hour <= 12 else end_hour - 12}{' AM' if end_hour < 12 else ' PM'}"
                
                # Select a random template
                template = self.recommendation_templates['work_hours'][0]  # Use the first template for productive hours
                
                # Format the template
                recommendation = template.format(
                    start_hour=start_hour_fmt,
                    end_hour=end_hour_fmt
                )
                
                recommendations.append({
                    'type': 'work_hours',
                    'start_hour': start_hour,
                    'end_hour': end_hour,
                    'is_productive': True,
                    'recommendation': recommendation,
                })
        
        # Find least productive hours (bottom 25%)
        unproductive_hours = significant_hours.nsmallest(max(1, len(significant_hours) // 4), 'productivity_ratio')
        
        if len(unproductive_hours) > 0:
            # Find consecutive unproductive hours
            unproductive_hour_indices = unproductive_hours.index.tolist()
            unproductive_hour_indices.sort()
            
            # Find the longest sequence of consecutive hours
            sequences = []
            current_sequence = [unproductive_hour_indices[0]]
            
            for i in range(1, len(unproductive_hour_indices)):
                if unproductive_hour_indices[i] == unproductive_hour_indices[i-1] + 1:
                    current_sequence.append(unproductive_hour_indices[i])
                else:
                    sequences.append(current_sequence)
                    current_sequence = [unproductive_hour_indices[i]]
            
            sequences.append(current_sequence)
            
            # Find the longest sequence
            longest_sequence = max(sequences, key=len)
            
            if len(longest_sequence) > 0:
                start_hour = longest_sequence[0]
                end_hour = longest_sequence[-1] + 1  # Add 1 to include the end hour
                
                # Format hours in 12-hour format
                start_hour_fmt = f"{start_hour if start_hour <= 12 else start_hour - 12}{' AM' if start_hour < 12 else ' PM'}"
                end_hour_fmt = f"{end_hour if end_hour <= 12 else end_hour - 12}{' AM' if end_hour < 12 else ' PM'}"
                
                # Select a random template
                template = self.recommendation_templates['work_hours'][1]  # Use the second template for unproductive hours
                
                # Format the template
                recommendation = template.format(
                    start_hour=start_hour_fmt,
                    end_hour=end_hour_fmt
                )
                
                recommendations.append({
                    'type': 'work_hours',
                    'start_hour': start_hour,
                    'end_hour': end_hour,
                    'is_productive': False,
                    'recommendation': recommendation,
                })
        
        return recommendations
    
    def _analyze_breaks(self, activities, threshold_minutes=90):
        """
        Analyze work sessions without breaks.
        
        Args:
            activities (list): List of activity dictionaries.
            threshold_minutes (int): Threshold in minutes for considering a session as too long.
            
        Returns:
            list: List of recommendations.
        """
        recommendations = []
        
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        if len(df) == 0 or 'timestamp' not in df.columns or 'duration' not in df.columns:
            return recommendations
        
        # Convert timestamp to datetime
        df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Sort by timestamp
        df = df.sort_values('timestamp')
        
        # Calculate time differences between activities
        df['next_timestamp'] = df['timestamp'].shift(-1)
        df['time_diff'] = (df['next_timestamp'] - df['timestamp']).dt.total_seconds()
        
        # Define a break as a gap of more than 5 minutes between activities
        df['is_break'] = df['time_diff'] > 300  # 5 minutes in seconds
        
        # Calculate session durations (time between breaks)
        session_durations = []
        current_session_duration = 0
        
        for _, row in df.iterrows():
            current_session_duration += row['duration']
            
            if row['is_break'] or pd.isna(row['time_diff']):
                if current_session_duration > 0:
                    session_durations.append(current_session_duration)
                current_session_duration = 0
        
        # Add the last session if it exists
        if current_session_duration > 0:
            session_durations.append(current_session_duration)
        
        # Convert seconds to minutes
        session_durations_minutes = [duration / 60 for duration in session_durations]
        
        # Find long sessions
        long_sessions = [duration for duration in session_durations_minutes if duration > threshold_minutes]
        
        if long_sessions:
            # Get the longest session
            longest_session = max(long_sessions)
            
            # Select a random template
            template = np.random.choice(self.recommendation_templates['breaks'])
            
            # Format the template
            recommendation = template.format(duration=int(longest_session))
            
            recommendations.append({
                'type': 'breaks',
                'duration_minutes': int(longest_session),
                'recommendation': recommendation,
            })
        
        return recommendations
    
    def _analyze_productive_apps(self, activities, threshold_minutes=30):
        """
        Analyze productive app usage.
        
        Args:
            activities (list): List of activity dictionaries.
            threshold_minutes (int): Threshold in minutes for considering an app as productive.
            
        Returns:
            list: List of recommendations.
        """
        recommendations = []
        
        # Convert activities to DataFrame
        df = pd.DataFrame(activities)
        
        if len(df) == 0 or 'category' not in df.columns:
            return recommendations
        
        # Filter productive activities
        productive_df = df[df['category'] == 'productive']
        
        if len(productive_df) == 0:
            return recommendations
        
        # Group by app and calculate total duration
        app_durations = productive_df.groupby('app')['duration'].sum().reset_index()
        
        # Convert seconds to minutes
        app_durations['minutes'] = app_durations['duration'] / 60
        
        # Filter apps with duration above threshold
        productive_apps = app_durations[app_durations['minutes'] > threshold_minutes]
        
        if len(productive_apps) == 0:
            return recommendations
        
        # Get the most used productive app
        most_productive_app = productive_apps.loc[productive_apps['minutes'].idxmax()]
        
        # Select a random template
        template = np.random.choice(self.recommendation_templates['productive_apps'])
        
        # Format the template
        recommendation = template.format(
            app=most_productive_app['app'],
            duration=int(most_productive_app['minutes'])
        )
        
        recommendations.append({
            'type': 'productive_apps',
            'app': most_productive_app['app'],
            'duration_minutes': int(most_productive_app['minutes']),
            'recommendation': recommendation,
        })
        
        return recommendations
    
    def generate_recommendations(self, activities, max_recommendations=3):
        """
        Generate productivity improvement recommendations.
        
        Args:
            activities (list): List of activity dictionaries.
            max_recommendations (int): Maximum number of recommendations to generate.
            
        Returns:
            list: List of recommendation dictionaries.
        """
        all_recommendations = []
        
        # Analyze distracting apps
        all_recommendations.extend(self._analyze_distracting_apps(activities))
        
        # Analyze context switching
        all_recommendations.extend(self._analyze_context_switching(activities))
        
        # Analyze work hours
        all_recommendations.extend(self._analyze_work_hours(activities))
        
        # Analyze breaks
        all_recommendations.extend(self._analyze_breaks(activities))
        
        # Analyze productive apps
        all_recommendations.extend(self._analyze_productive_apps(activities))
        
        # Shuffle recommendations
        np.random.shuffle(all_recommendations)
        
        # Return at most max_recommendations
        return all_recommendations[:max_recommendations]


if __name__ == '__main__':
    # Example usage
    engine = RecommendationEngine()
    
    # Example activities
    activities = [
        {'app': 'Visual Studio Code', 'title': 'index.js', 'category': 'productive', 'duration': 3600, 'timestamp': '2023-01-01T09:00:00Z'},
        {'app': 'Chrome', 'title': 'GitHub', 'category': 'productive', 'duration': 1800, 'timestamp': '2023-01-01T10:00:00Z'},
        {'app': 'Chrome', 'title': 'YouTube', 'category': 'distracting', 'duration': 1800, 'timestamp': '2023-01-01T10:30:00Z'},
        {'app': 'Slack', 'title': 'general', 'category': 'neutral', 'duration': 900, 'timestamp': '2023-01-01T11:00:00Z'},
        {'app': 'Chrome', 'title': 'Facebook', 'category': 'distracting', 'duration': 1800, 'timestamp': '2023-01-01T11:15:00Z'},
        {'app': 'Visual Studio Code', 'title': 'main.js', 'category': 'productive', 'duration': 3600, 'timestamp': '2023-01-01T11:45:00Z'},
        {'app': 'Terminal', 'title': 'bash', 'category': 'productive', 'duration': 1800, 'timestamp': '2023-01-01T12:45:00Z'},
        {'app': 'Chrome', 'title': 'Twitter', 'category': 'distracting', 'duration': 900, 'timestamp': '2023-01-01T13:15:00Z'},
        {'app': 'Visual Studio Code', 'title': 'app.js', 'category': 'productive', 'duration': 3600, 'timestamp': '2023-01-01T13:30:00Z'},
        {'app': 'Chrome', 'title': 'Stack Overflow', 'category': 'productive', 'duration': 1800, 'timestamp': '2023-01-01T14:30:00Z'},
        {'app': 'Chrome', 'title': 'Instagram', 'category': 'distracting', 'duration': 900, 'timestamp': '2023-01-01T15:00:00Z'},
    ]
    
    # Generate recommendations
    recommendations = engine.generate_recommendations(activities)
    
    # Print recommendations
    for i, recommendation in enumerate(recommendations):
        print(f'Recommendation {i+1}: {recommendation["recommendation"]}')
        print(f'Type: {recommendation["type"]}')
        print()