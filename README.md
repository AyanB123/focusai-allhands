# ProductivityPro

An AI-powered productivity companion for optimal work habits.

## Features

- **Activity Tracking**: Automatically tracks your application usage and categorizes activities
- **Productivity Analytics**: Visualizes your productivity patterns with detailed charts and insights
- **Focus Mode**: Helps you stay focused with customizable focus sessions
- **AI Assistant**: Provides personalized recommendations to improve your productivity
- **Task Management**: Organize and prioritize your tasks with AI-powered scheduling
- **Workflow Automation**: Create custom workflows to streamline repetitive tasks

## Tech Stack

- **Frontend**: Electron, React, TailwindCSS
- **Backend**: Node.js, Express, Python Flask
- **AI/ML**: scikit-learn, TensorFlow (planned)
- **Data Visualization**: Chart.js, D3.js, Plotly

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/productivitypro.git
   cd productivitypro
   ```

2. Install Node.js dependencies:
   ```
   npm install
   ```

3. Install Python dependencies:
   ```
   pip install flask flask-cors pandas scikit-learn
   ```

4. Start the application:
   ```
   npm start
   ```

## Development

### Running in Development Mode

```
npm run dev
```

This will start the application with hot reloading enabled.

### Building for Production

```
npm run build
```

This will create distributable packages for your platform in the `dist` directory.

## Project Structure

```
productivitypro/
├── src/
│   ├── main/              # Electron main process
│   ├── renderer/          # React frontend
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── context/       # React context providers
│   │   ├── styles/        # CSS and styling
│   │   └── utils/         # Utility functions
│   └── python/            # Python backend
│       └── models/        # ML models
├── dist/                  # Compiled files
├── assets/                # Static assets
└── package.json           # Project configuration
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
