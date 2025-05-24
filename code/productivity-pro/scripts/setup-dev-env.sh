#!/bin/bash

# ProductivityPro Development Environment Setup Script

echo "Setting up ProductivityPro development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js v18.x or later."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is not installed. Please install Python 3.9 or later."
    exit 1
fi

# Install global Node.js dependencies
echo "Installing global Node.js dependencies..."
npm install -g electron electron-builder nodemon

# Install project Node.js dependencies
echo "Installing project Node.js dependencies..."
npm install

# Set up Python virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p assets/icons

# Set up Git hooks
echo "Setting up Git hooks..."
if [ -d ".git" ]; then
    npm install -g husky
    npx husky install
    npx husky add .husky/pre-commit "npm run lint"
fi

echo "Development environment setup complete!"
echo "To start the application, run: npm run dev"