import numpy as np
import pandas as pd
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split

class ActivityClassifier:
    """
    A machine learning model to classify application activities into productivity categories.
    """
    
    def __init__(self, model_path=None):
        """
        Initialize the activity classifier.
        
        Args:
            model_path (str, optional): Path to a saved model file. If None, a new model will be created.
        """
        self.categories = ['productive', 'neutral', 'distracting']
        
        if model_path and os.path.exists(model_path):
            # Load existing model
            with open(model_path, 'rb') as f:
                self.pipeline = pickle.load(f)
        else:
            # Create new model pipeline
            self.pipeline = Pipeline([
                ('vectorizer', TfidfVectorizer(analyzer='word', ngram_range=(1, 2), max_features=10000)),
                ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
            ])
    
    def train(self, app_names, categories):
        """
        Train the model on application names and their categories.
        
        Args:
            app_names (list): List of application names.
            categories (list): List of corresponding categories ('productive', 'neutral', 'distracting').
            
        Returns:
            float: Accuracy score of the model.
        """
        # Split data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(
            app_names, categories, test_size=0.2, random_state=42
        )
        
        # Train the model
        self.pipeline.fit(X_train, y_train)
        
        # Evaluate the model
        accuracy = self.pipeline.score(X_test, y_test)
        return accuracy
    
    def predict(self, app_name):
        """
        Predict the category of an application.
        
        Args:
            app_name (str): Name of the application.
            
        Returns:
            str: Predicted category ('productive', 'neutral', 'distracting').
        """
        # Make prediction
        prediction = self.pipeline.predict([app_name])[0]
        return prediction
    
    def predict_proba(self, app_name):
        """
        Get probability estimates for each category.
        
        Args:
            app_name (str): Name of the application.
            
        Returns:
            dict: Dictionary mapping categories to probabilities.
        """
        # Get probability estimates
        probas = self.pipeline.predict_proba([app_name])[0]
        
        # Map probabilities to categories
        result = {}
        for i, category in enumerate(self.pipeline.classes_):
            result[category] = probas[i]
        
        return result
    
    def save(self, model_path):
        """
        Save the model to a file.
        
        Args:
            model_path (str): Path to save the model.
        """
        with open(model_path, 'wb') as f:
            pickle.dump(self.pipeline, f)
    
    def load(self, model_path):
        """
        Load a model from a file.
        
        Args:
            model_path (str): Path to the saved model.
        """
        with open(model_path, 'rb') as f:
            self.pipeline = pickle.load(f)


def create_sample_training_data():
    """
    Create sample training data for the activity classifier.
    
    Returns:
        tuple: (app_names, categories)
    """
    # Sample application names and their categories
    data = [
        # Productive applications
        ('Visual Studio Code', 'productive'),
        ('PyCharm', 'productive'),
        ('IntelliJ IDEA', 'productive'),
        ('WebStorm', 'productive'),
        ('Microsoft Excel', 'productive'),
        ('Microsoft Word', 'productive'),
        ('Microsoft PowerPoint', 'productive'),
        ('Microsoft Outlook', 'productive'),
        ('Slack', 'productive'),
        ('Microsoft Teams', 'productive'),
        ('Zoom', 'productive'),
        ('Figma', 'productive'),
        ('Notion', 'productive'),
        ('Jira', 'productive'),
        ('Trello', 'productive'),
        ('Asana', 'productive'),
        ('Google Docs', 'productive'),
        ('Google Sheets', 'productive'),
        ('Google Slides', 'productive'),
        ('Terminal', 'productive'),
        ('Command Prompt', 'productive'),
        ('PowerShell', 'productive'),
        ('Adobe Photoshop', 'productive'),
        ('Adobe Illustrator', 'productive'),
        ('Adobe XD', 'productive'),
        ('Sketch', 'productive'),
        ('Postman', 'productive'),
        ('Insomnia', 'productive'),
        ('MySQL Workbench', 'productive'),
        ('pgAdmin', 'productive'),
        ('MongoDB Compass', 'productive'),
        ('Docker Desktop', 'productive'),
        ('GitHub Desktop', 'productive'),
        ('GitKraken', 'productive'),
        ('Sourcetree', 'productive'),
        
        # Neutral applications
        ('Google Chrome', 'neutral'),
        ('Mozilla Firefox', 'neutral'),
        ('Microsoft Edge', 'neutral'),
        ('Safari', 'neutral'),
        ('Brave Browser', 'neutral'),
        ('Opera', 'neutral'),
        ('File Explorer', 'neutral'),
        ('Finder', 'neutral'),
        ('Calculator', 'neutral'),
        ('Calendar', 'neutral'),
        ('Notes', 'neutral'),
        ('Reminders', 'neutral'),
        ('Clock', 'neutral'),
        ('Weather', 'neutral'),
        ('Maps', 'neutral'),
        ('Photos', 'neutral'),
        ('Camera', 'neutral'),
        ('Voice Recorder', 'neutral'),
        ('Settings', 'neutral'),
        ('System Preferences', 'neutral'),
        ('Control Panel', 'neutral'),
        ('Task Manager', 'neutral'),
        ('Activity Monitor', 'neutral'),
        ('Disk Utility', 'neutral'),
        ('Bluetooth', 'neutral'),
        ('Wi-Fi', 'neutral'),
        ('VPN', 'neutral'),
        ('Printer', 'neutral'),
        ('Scanner', 'neutral'),
        ('Sound', 'neutral'),
        ('Display', 'neutral'),
        ('Keyboard', 'neutral'),
        ('Mouse', 'neutral'),
        ('Touchpad', 'neutral'),
        ('Battery', 'neutral'),
        
        # Distracting applications
        ('YouTube', 'distracting'),
        ('Netflix', 'distracting'),
        ('Hulu', 'distracting'),
        ('Disney+', 'distracting'),
        ('Amazon Prime Video', 'distracting'),
        ('Twitch', 'distracting'),
        ('Facebook', 'distracting'),
        ('Instagram', 'distracting'),
        ('Twitter', 'distracting'),
        ('TikTok', 'distracting'),
        ('Snapchat', 'distracting'),
        ('Pinterest', 'distracting'),
        ('Reddit', 'distracting'),
        ('Discord', 'distracting'),
        ('WhatsApp', 'distracting'),
        ('Telegram', 'distracting'),
        ('Signal', 'distracting'),
        ('Messenger', 'distracting'),
        ('Steam', 'distracting'),
        ('Epic Games Launcher', 'distracting'),
        ('Battle.net', 'distracting'),
        ('Origin', 'distracting'),
        ('Uplay', 'distracting'),
        ('GOG Galaxy', 'distracting'),
        ('Minecraft', 'distracting'),
        ('Fortnite', 'distracting'),
        ('Call of Duty', 'distracting'),
        ('League of Legends', 'distracting'),
        ('Dota 2', 'distracting'),
        ('Counter-Strike', 'distracting'),
        ('Valorant', 'distracting'),
        ('Apex Legends', 'distracting'),
        ('Overwatch', 'distracting'),
        ('World of Warcraft', 'distracting'),
        ('Hearthstone', 'distracting'),
    ]
    
    # Unpack data
    app_names, categories = zip(*data)
    
    return app_names, categories


def train_and_save_model(output_path='model.pkl'):
    """
    Train a model on sample data and save it.
    
    Args:
        output_path (str): Path to save the model.
        
    Returns:
        ActivityClassifier: Trained model.
    """
    # Create sample data
    app_names, categories = create_sample_training_data()
    
    # Create and train model
    model = ActivityClassifier()
    accuracy = model.train(app_names, categories)
    
    print(f"Model trained with accuracy: {accuracy:.2f}")
    
    # Save model
    model.save(output_path)
    print(f"Model saved to {output_path}")
    
    return model


if __name__ == "__main__":
    # Train and save model
    model_path = os.path.join(os.path.dirname(__file__), 'activity_classifier_model.pkl')
    model = train_and_save_model(model_path)
    
    # Test model on some examples
    test_apps = [
        'Visual Studio Code',
        'YouTube',
        'Google Chrome',
        'Microsoft Word',
        'Netflix',
        'Unknown App',
    ]
    
    print("\nTesting model predictions:")
    for app in test_apps:
        prediction = model.predict(app)
        probas = model.predict_proba(app)
        
        print(f"\nApp: {app}")
        print(f"Prediction: {prediction}")
        print("Probabilities:")
        for category, proba in probas.items():
            print(f"  {category}: {proba:.2f}")