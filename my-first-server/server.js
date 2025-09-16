// Import express
const express = require('express');

// Create an Express app
const app = express();

// Define a route
app.get('/api', (req, res) => {
  res.json({ message: "API is running!" });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
