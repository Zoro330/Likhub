const express = require('express');
const app = express();

// Respond to all requests with a simple HTML page
app.use((req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Minimal Likhub Page</title>
      <style>
        body {
          font-family: sans-serif;
          margin: 0;
          padding: 20px;
          text-align: center;
          background-color: #f5f5f5;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Likhub Minimal Page</h1>
        <p>This is a completely self-contained page with no external resources.</p>
        <p>Path: ${req.path}</p>
      </div>
    </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Minimal server running on port ${PORT}`);
}); 