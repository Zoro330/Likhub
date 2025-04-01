const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// Debug information about build directory
const buildPath = path.join(__dirname, 'build');
console.log('Checking build directory:', buildPath);
console.log('Build directory exists:', fs.existsSync(buildPath));

// Prepare fallback content
let fallbackContent = '<html><body><h1>Error: Build files not found</h1></body></html>';
try {
  const fallbackPath = path.join(__dirname, 'fallback.html');
  if (fs.existsSync(fallbackPath)) {
    fallbackContent = fs.readFileSync(fallbackPath, 'utf8');
    console.log('Using fallback.html as backup');
  }
} catch (err) {
  console.error('Error reading fallback page:', err);
}

if (fs.existsSync(buildPath)) {
  const indexPath = path.join(buildPath, 'index.html');
  console.log('index.html exists:', fs.existsSync(indexPath));
  
  if (fs.existsSync(indexPath)) {
    try {
      const stats = fs.statSync(indexPath);
      console.log('index.html size:', stats.size);
      console.log('index.html modified:', stats.mtime);
    } catch (err) {
      console.error('Error checking index.html stats:', err);
    }
  }
}

// Add permissive security headers to all responses
app.use((req, res, next) => {
  // Set very permissive CSP headers to allow all resources
  res.setHeader(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval'; font-src * data:; img-src * data:; connect-src *"
  );
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

// Serve static files from the build directory if it exists
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
} else {
  console.warn('Build directory not found! Using fallback for all routes.');
}

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).send();
});

// For any request that doesn't match the static files, check for index.html or use fallback
app.get('*', function(req, res) {
  try {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.warn('index.html not found! Sending fallback page.');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(fallbackContent);
    }
  } catch (err) {
    console.error('Error serving page:', err);
    res.setHeader('Content-Type', 'text/html');
    res.status(500).send(fallbackContent);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
}); 