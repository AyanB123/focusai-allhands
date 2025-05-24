# Development Environment Setup

This guide provides instructions for setting up the ProductivityPro development environment. Follow these steps to get your local development environment ready for contributing to the project.

## Prerequisites

Before setting up the ProductivityPro development environment, ensure you have the following installed:

- **Node.js** (v16.x or later)
- **Python** (v3.9 or later)
- **Git** (v2.30 or later)
- **Docker** (v20.10 or later) and Docker Compose
- **MongoDB** (v5.0 or later) - or use the Docker container
- **Visual Studio Code** (recommended) or your preferred IDE

## Repository Setup

1. Clone the repository:

```bash
git clone https://github.com/productivitypro/productivitypro.git
cd productivitypro
```

2. Set up Git hooks:

```bash
npm run setup-hooks
```

This will install pre-commit hooks for linting and formatting.

## Frontend Setup

The frontend is built with Electron and React.

1. Install dependencies:

```bash
cd frontend
npm install
```

2. Create a `.env.local` file:

```bash
cp .env.example .env.local
```

3. Start the development server:

```bash
npm run dev
```

This will start the Electron app in development mode.

## Backend Setup

The backend is built with Node.js and Express.

1. Install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file:

```bash
cp .env.example .env
```

3. Start the development server:

```bash
npm run dev
```

This will start the backend server in development mode with hot reloading.

## AI/ML Setup

The AI/ML components are built with Python and FastAPI.

1. Create and activate a virtual environment:

```bash
cd ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
python -m uvicorn main:app --reload
```

This will start the FastAPI server in development mode with hot reloading.

## Docker Setup (Alternative)

You can also use Docker to set up the entire development environment:

1. Build and start the containers:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

This will start the frontend, backend, AI/ML, and MongoDB containers.

2. View logs:

```bash
docker-compose -f docker-compose.dev.yml logs -f
```

3. Stop the containers:

```bash
docker-compose -f docker-compose.dev.yml down
```

## Database Setup

If you're not using Docker, you'll need to set up MongoDB:

1. Start MongoDB:

```bash
mongod --dbpath /path/to/data/directory
```

2. Create the database:

```bash
mongo
> use productivitypro
> db.createUser({
    user: "productivitypro",
    pwd: "password",
    roles: [{ role: "readWrite", db: "productivitypro" }]
  })
```

3. Update your `.env` file with the MongoDB connection string.

## IDE Setup

### Visual Studio Code

1. Install recommended extensions:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-python.python
code --install-extension ms-azuretools.vscode-docker
```

2. Use the workspace settings:

```bash
cp .vscode/settings.example.json .vscode/settings.json
```

### JetBrains IDEs (WebStorm, PyCharm)

1. Import the code style settings:
   - Go to Settings/Preferences > Editor > Code Style
   - Import the `.editorconfig` file

2. Set up ESLint and Prettier:
   - Go to Settings/Preferences > Languages & Frameworks > JavaScript > Code Quality Tools
   - Enable ESLint and Prettier

## Testing Setup

1. Install test dependencies:

```bash
# Frontend
cd frontend
npm install --save-dev

# Backend
cd backend
npm install --save-dev

# AI/ML
cd ai
pip install -r requirements-dev.txt
```

2. Run tests:

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test

# AI/ML
cd ai
pytest
```

## Troubleshooting

### Common Issues

#### Node.js Version Mismatch

If you encounter errors related to Node.js version:

```bash
nvm install 16
nvm use 16
```

#### Python Version Mismatch

If you encounter errors related to Python version:

```bash
pyenv install 3.9
pyenv local 3.9
```

#### MongoDB Connection Issues

If you can't connect to MongoDB:

1. Check if MongoDB is running:

```bash
ps aux | grep mongod
```

2. Verify the connection string in your `.env` file.

#### Port Conflicts

If you encounter port conflicts:

1. Check which process is using the port:

```bash
# On Linux/macOS
lsof -i :3000

# On Windows
netstat -ano | findstr :3000
```

2. Update the port in your `.env` file or stop the conflicting process.

### Getting Help

If you encounter issues not covered here:

1. Check the [GitHub Issues](https://github.com/productivitypro/productivitypro/issues) for similar problems
2. Ask in the [Discord channel](https://discord.gg/productivitypro)
3. Contact the development team at dev@productivitypro.app

## Next Steps

Now that your development environment is set up, you can:

1. Read the [Coding Standards](coding-standards.md) to understand the project's coding conventions
2. Review the [Git Workflow](git-workflow.md) to learn how to contribute changes
3. Explore the [Architecture Documentation](../architecture/README.md) to understand the system design