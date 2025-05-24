# ProductivityPro

ProductivityPro is an AI-powered productivity tracking and optimization application that helps you understand your work patterns, improve focus, and maximize productivity.

## Features

- **Activity Tracking**: Automatically tracks your computer usage, applications, and websites
- **Smart Categorization**: Categorizes your activities using AI and customizable rules
- **Focus Analysis**: Identifies your most productive times and patterns
- **Productivity Insights**: Provides actionable insights to improve your workflow
- **Focus Assistant**: AI-powered assistant to help you maintain focus and manage distractions

## Technology Stack

- **Electron**: Cross-platform desktop application framework
- **React**: UI library for building the user interface
- **Node.js**: Backend runtime for the main process
- **SQLite**: Local database for storing activity data
- **TensorFlow/PyTorch**: Machine learning frameworks for AI features
- **Express**: API server for communication between components

## Development Setup

### Prerequisites

- Node.js v18.x or later
- Python 3.9 or later
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/productivity-pro.git
   cd productivity-pro
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Set up Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Build the application:
   ```bash
   npm run build
   ```

## Project Structure

```
productivity-pro/
├── src/
│   ├── main/                   # Electron main process
│   │   ├── main.js             # Entry point
│   │   ├── activity-tracker/   # Activity tracking modules
│   │   ├── api/                # Express API endpoints
│   │   └── db/                 # SQLite database handlers
│   ├── renderer/               # Electron renderer process (React)
│   │   ├── components/         # React components
│   │   ├── screens/            # Screen components
│   │   ├── styles/             # CSS styles
│   │   └── index.js            # Renderer entry point
│   └── ai/                     # Python AI/ML modules
│       ├── api/                # FastAPI server
│       ├── models/             # Neural network models
│       ├── preprocessing/      # Data preprocessing utilities
│       └── training/           # Model training scripts
├── assets/                     # Static assets
├── tests/                      # Test files
└── scripts/                    # Build and utility scripts
```

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [TensorFlow](https://www.tensorflow.org/)
- [PyTorch](https://pytorch.org/)
- [FastAPI](https://fastapi.tiangolo.com/)