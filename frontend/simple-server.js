const express = require('express');
const path = require('path');
const app = express();

// Serve static files with no CSP restrictions
app.use(express.static(path.join(__dirname, 'build')));

// Respond to all GET requests by serving index.html
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
}); 