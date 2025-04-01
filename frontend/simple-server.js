const express = require('express');
const path = require('path');
const app = express();

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

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).send();
});

// For any request that doesn't match the static files, send index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
}); 