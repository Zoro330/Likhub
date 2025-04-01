const express = require('express');
const path = require('path');
const app = express();

// Set security headers with more permissive CSP for fonts
app.use((req, res, next) => {
  // Set Content-Security-Policy with more permissive settings for fonts
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; connect-src 'self' https://likhub-backend.onrender.com; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval';"
  );
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'build')));

// Handle OPTIONS requests
app.options('*', (req, res) => {
  res.status(200).send();
});

// For any request that doesn't match the static files, send index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 