# ProductivityPro

![ProductivityPro Logo](assets/logo.png)

[![Build Status](https://github.com/productivitypro/productivitypro/workflows/Build%20and%20Test/badge.svg)](https://github.com/productivitypro/productivitypro/actions)
[![Documentation Status](https://github.com/productivitypro/productivitypro/workflows/Documentation/badge.svg)](https://docs.productivitypro.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

ProductivityPro is an AI-driven productivity tracking application that enhances time tracking, activity analysis, and work optimization through advanced AI capabilities.

## Features

- **Automatic Activity Tracking**: Track app and website usage without manual input
- **AI-Powered Insights**: Get personalized productivity insights from five neural networks
- **Predictive Scheduling**: Receive AI-generated schedule suggestions based on your productivity patterns
- **Workflow Optimization**: Visualize and optimize your workflow with graph-based insights
- **Focus Mode**: Boost productivity with distraction blocking and focus timers
- **Chat Assistant**: Ask questions about your productivity in natural language
- **Integrations**: Connect with Google Calendar, Trello, and Outlook

## Installation

### Windows

```bash
# Download the installer
curl -LO https://github.com/productivitypro/productivitypro/releases/latest/download/ProductivityPro-Setup.exe

# Run the installer
./ProductivityPro-Setup.exe
```

### macOS

```bash
# Download the DMG
curl -LO https://github.com/productivitypro/productivitypro/releases/latest/download/ProductivityPro.dmg

# Mount the DMG and install
hdiutil attach ProductivityPro.dmg
cp -R "/Volumes/ProductivityPro/ProductivityPro.app" /Applications
hdiutil detach "/Volumes/ProductivityPro"
```

### Linux

```bash
# Download the AppImage
curl -LO https://github.com/productivitypro/productivitypro/releases/latest/download/ProductivityPro.AppImage

# Make it executable
chmod +x ProductivityPro.AppImage

# Run the application
./ProductivityPro.AppImage
```

## Development

### Prerequisites

- Node.js 18+
- Python 3.10+
- SQLite 3

### Setup

```bash
# Clone the repository
git clone https://github.com/productivitypro/productivitypro.git
cd productivitypro

# Install dependencies
npm install
pip install -r requirements.txt

# Start the development server
npm run dev
```

### Architecture

ProductivityPro follows a modular architecture with the following main components:

1. **Electron App**: Cross-platform desktop application shell
2. **Frontend**: React-based UI with Tailwind CSS
3. **Backend**: Node.js server with Express and FastAPI
4. **AI/ML**: Python-based neural network models
5. **Storage**: SQLite for local storage, optional AWS for cloud sync

### Development Workflow

1. Create a feature branch from `develop`
2. Implement your changes
3. Write tests for your changes
4. Create a pull request to `develop`
5. Address review feedback
6. Merge your changes

For more details, see the [Development Workflow](docs/development/workflow.md) documentation.

## Documentation

- [User Guide](https://docs.productivitypro.app/user/)
- [API Documentation](https://docs.productivitypro.app/api/)
- [Developer Guide](https://docs.productivitypro.app/development/)
- [Architecture](https://docs.productivitypro.app/architecture/)

## Contributing

We welcome contributions to ProductivityPro! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## License

ProductivityPro is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Electron](https://www.electronjs.org/)
- [React](https://reactjs.org/)
- [PyTorch](https://pytorch.org/)
- [TensorFlow](https://www.tensorflow.org/)
- [SQLite](https://www.sqlite.org/)
- [Chart.js](https://www.chartjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)