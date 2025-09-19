// server.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db('resumeData');
    const profiles = db.collection('profiles');

    // ✅ Route to fetch all profiles (pretty JSON)
    app.get('/all', async (req, res) => {
      try {
        const data = await profiles.find().toArray();
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data, null, 2)); // pretty print
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch profiles' });
      }
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('🚀 API is running! Go to /all to see profiles');
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

main();
