# ProductivityPro Architecture

This section provides detailed documentation on the architecture of ProductivityPro, covering frontend, backend, and AI/ML components.

## Contents

- [Overview](overview.md)
- [Frontend Architecture](frontend.md)
- [Backend Architecture](backend.md)
- [AI/ML Architecture](ai-ml/README.md)
  - [Transformer](ai-ml/transformer.md)
  - [Graph Neural Network (GNN)](ai-ml/gnn.md)
  - [Long Short-Term Memory (LSTM)](ai-ml/lstm.md)
  - [Convolutional Neural Network (CNN)](ai-ml/cnn.md)
  - [Generative Adversarial Network (GAN)](ai-ml/gan.md)
- [Diagrams](diagrams/README.md)

## High-Level Architecture

ProductivityPro follows a modular architecture with the following main components:

1. **Electron App**: Cross-platform desktop application shell
2. **Frontend**: React-based UI with Tailwind CSS
3. **Backend**: Node.js server with Express and FastAPI
4. **AI/ML**: Python-based neural network models
5. **Storage**: SQLite for local storage, optional AWS for cloud sync

## Component Interactions

- Frontend communicates with Backend via REST API and WebSockets
- Backend processes activity data and sends it to AI/ML components
- AI/ML components provide insights and predictions back to Backend
- Backend serves processed data to Frontend for visualization

## Data Flow

1. Activity Tracker captures user activity (apps, websites, idle time)
2. Event Processor normalizes and categorizes activity data
3. AI models analyze data for patterns, predictions, and insights
4. Frontend displays visualizations, suggestions, and reports

## Technology Stack

- **Frontend**: Electron, React, Tailwind CSS, Chart.js
- **Backend**: Node.js, Express, SQLite, Redis
- **AI/ML**: Python, PyTorch, TensorFlow, FastAPI
- **DevOps**: GitHub Actions, Docker, AWS