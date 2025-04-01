const http = require('http');
const fs = require('fs');
const path = require('path');

// Create an emergency HTML response with NO external dependencies
const emergencyHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Likhub Emergency Page</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.5;
      margin: 0;
      padding: 0;
      color: #333;
      background-color: #f5f5f5;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header {
      background-color: #27ae60;
      color: white;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      padding: 2rem;
      max-width: 800px;
      width: 100%;
      margin-bottom: 2rem;
    }
    h1 {
      margin-top: 0;
      color: #2c3e50;
    }
    h2 {
      color: #27ae60;
    }
    .button {
      display: inline-block;
      background-color: #27ae60;
      color: white;
      padding: 0.5rem 1rem;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 1rem;
    }
    code {
      background-color: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: monospace;
    }
    footer {
      text-align: center;
      padding: 1rem;
      background-color: #2c3e50;
      color: white;
    }
  </style>
</head>
<body>
  <header>
    <h1>Likhub</h1>
  </header>
  <main>
    <div class="card">
      <h2>Welcome to Likhub</h2>
      <p>You are viewing the emergency backup page. The main application is currently unavailable.</p>
      <p>This page is served directly from Node.js without any external resources to avoid Content Security Policy issues.</p>
      <p>Status: Maintenance Mode</p>
    </div>
    <div class="card">
      <h2>Technical Information</h2>
      <p>The application is experiencing deployment issues on Render. We're working to resolve these problems.</p>
      <p>Current issues:</p>
      <ul>
        <li>Content Security Policy blocking Google Fonts</li>
        <li>Static file serving configuration issues</li>
        <li>React application build process complications</li>
      </ul>
    </div>
  </main>
  <footer>
    &copy; 2023 Likhub - Direct Server
  </footer>
</body>
</html>
`;

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Set headers to allow fonts and avoid CSP issues
  res.setHeader('Content-Type', 'text/html');
  
  // Respond with emergency HTML for all requests
  res.writeHead(200);
  res.end(emergencyHTML);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Emergency server running on port ${PORT}`);
}); 