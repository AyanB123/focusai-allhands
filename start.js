const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { app } = require('electron');

// Check if Python is installed
function checkPythonInstallation() {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', ['--version']);
    
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(true);
      } else {
        // Try python3
        const python3Process = spawn('python3', ['--version']);
        
        python3Process.on('close', (code) => {
          if (code === 0) {
            resolve(true);
          } else {
            reject(new Error('Python is not installed'));
          }
        });
      }
    });
  });
}

// Check if required Python packages are installed
function checkPythonPackages() {
  return new Promise((resolve, reject) => {
    const requirements = ['flask', 'flask-cors', 'pandas', 'scikit-learn'];
    const missingPackages = [];
    
    // Check each package
    const promises = requirements.map(pkg => {
      return new Promise((resolve) => {
        const pythonProcess = spawn('python', ['-c', `import ${pkg.replace('-', '_')}`]);
        
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            missingPackages.push(pkg);
          }
          resolve();
        });
      });
    });
    
    // Wait for all checks to complete
    Promise.all(promises).then(() => {
      if (missingPackages.length > 0) {
        reject(new Error(`Missing Python packages: ${missingPackages.join(', ')}`));
      } else {
        resolve();
      }
    });
  });
}

// Install missing Python packages
function installPythonPackages() {
  return new Promise((resolve, reject) => {
    console.log('Installing required Python packages...');
    
    const installProcess = spawn('pip', ['install', 'flask', 'flask-cors', 'pandas', 'scikit-learn']);
    
    installProcess.stdout.on('data', (data) => {
      console.log(`${data}`);
    });
    
    installProcess.stderr.on('data', (data) => {
      console.error(`${data}`);
    });
    
    installProcess.on('close', (code) => {
      if (code === 0) {
        console.log('Python packages installed successfully');
        resolve();
      } else {
        reject(new Error('Failed to install Python packages'));
      }
    });
  });
}

// Start Python server
function startPythonServer() {
  return new Promise((resolve) => {
    console.log('Starting Python server...');
    
    const serverPath = path.join(__dirname, 'src', 'python', 'server.py');
    const pythonProcess = spawn('python', [serverPath, '5000']);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python server: ${data}`);
      
      // Resolve when server is running
      if (data.toString().includes('Running on')) {
        resolve(pythonProcess);
      }
    });
    
    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python server error: ${data}`);
    });
    
    pythonProcess.on('close', (code) => {
      console.log(`Python server exited with code ${code}`);
    });
  });
}

// Start Electron app
function startElectronApp() {
  console.log('Starting Electron app...');
  
  // Set environment variables
  process.env.PYTHON_SERVER_URL = 'http://localhost:5000';
  
  // Start the Electron app
  require('./src/main/main.js');
}

// Main function
async function main() {
  try {
    // Check Python installation
    await checkPythonInstallation();
    console.log('Python is installed');
    
    // Check Python packages
    try {
      await checkPythonPackages();
      console.log('All required Python packages are installed');
    } catch (error) {
      console.error(error.message);
      await installPythonPackages();
    }
    
    // Start Python server
    const pythonProcess = await startPythonServer();
    
    // Start Electron app
    startElectronApp();
    
    // Handle app quit
    app.on('will-quit', () => {
      console.log('Shutting down Python server...');
      pythonProcess.kill();
    });
  } catch (error) {
    console.error('Error starting application:', error.message);
    process.exit(1);
  }
}

// Run the main function
main();