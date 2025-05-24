"""
ML Server

This module provides a simple HTTP server for the ML components.
"""

import os
import json
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import parse_qs, urlparse

from activity_classifier import ActivityClassifier
from productivity_predictor import ProductivityPredictor
from recommendation_engine import RecommendationEngine

# Initialize the ML components
classifier = ActivityClassifier()
predictor = ProductivityPredictor()
recommendation_engine = RecommendationEngine()

class MLRequestHandler(BaseHTTPRequestHandler):
    """
    HTTP request handler for ML server.
    """
    
    def _set_headers(self, content_type='application/json'):
        self.send_response(200)
        self.send_header('Content-type', content_type)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def do_OPTIONS(self):
        self._set_headers()
    
    def do_GET(self):
        """
        Handle GET requests.
        """
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        query = parse_qs(parsed_path.query)
        
        if path == '/health':
            # Health check endpoint
            self._set_headers()
            self.wfile.write(json.dumps({'status': 'ok'}).encode())
        else:
            # Unknown endpoint
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())
    
    def do_POST(self):
        """
        Handle POST requests.
        """
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode())
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Invalid JSON'}).encode())
            return
        
        if self.path == '/classify':
            # Classify an activity
            if 'activity' not in data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing activity'}).encode())
                return
            
            activity = data['activity']
            category = classifier.predict(activity)
            probas = classifier.predict_proba(activity)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'category': category,
                'probabilities': probas
            }).encode())
        
        elif self.path == '/train':
            # Train the classifier
            if 'activities' not in data or 'categories' not in data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing activities or categories'}).encode())
                return
            
            activities = data['activities']
            categories = data['categories']
            
            if len(activities) != len(categories):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Activities and categories must have the same length'}).encode())
                return
            
            accuracy = classifier.train(activities, categories)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'accuracy': accuracy
            }).encode())
        
        elif self.path == '/predict-productivity':
            # Predict productivity score
            if 'activities' not in data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing activities'}).encode())
                return
            
            activities = data['activities']
            score = predictor.predict(activities)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'score': score
            }).encode())
        
        elif self.path == '/train-predictor':
            # Train the productivity predictor
            if 'activities_list' not in data or 'scores' not in data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing activities_list or scores'}).encode())
                return
            
            activities_list = data['activities_list']
            scores = data['scores']
            
            if len(activities_list) != len(scores):
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Activities list and scores must have the same length'}).encode())
                return
            
            r2_score = predictor.train(activities_list, scores)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'r2_score': r2_score
            }).encode())
        
        elif self.path == '/recommendations':
            # Generate recommendations
            if 'activities' not in data:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Missing activities'}).encode())
                return
            
            activities = data['activities']
            max_recommendations = data.get('max_recommendations', 3)
            
            recommendations = recommendation_engine.generate_recommendations(activities, max_recommendations)
            
            self._set_headers()
            self.wfile.write(json.dumps({
                'recommendations': recommendations
            }).encode())
        
        else:
            # Unknown endpoint
            self.send_response(404)
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'Not found'}).encode())


def run_server(host='localhost', port=5000):
    """
    Run the ML server.
    
    Args:
        host (str): Host to bind to.
        port (int): Port to bind to.
    """
    server_address = (host, port)
    httpd = HTTPServer(server_address, MLRequestHandler)
    print(f'Starting ML server on {host}:{port}...')
    httpd.serve_forever()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='ML Server')
    parser.add_argument('--host', default='localhost', help='Host to bind to')
    parser.add_argument('--port', type=int, default=5000, help='Port to bind to')
    
    args = parser.parse_args()
    
    # Create models directory if it doesn't exist
    os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
    
    # Run the server
    run_server(args.host, args.port)