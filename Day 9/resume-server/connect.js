// connect.js
const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:27017';   // local MongoDB
const client = new MongoClient(url);

async function main() {
  try {
    await client.connect();
    const db = client.db('resumeData');     // database name
    // optional: create/verify collection by inserting a doc
    const res = await db.collection('profiles').insertOne({
      name: 'Node Inserted User',
      createdAt: new Date(),
      note: 'Inserted by connect.js'
    });

    console.log('✅ Connected to resumeData and inserted document. id =', res.insertedId);
  } catch (err) {
    console.error('❌ Error connecting or inserting:', err);
  } finally {
    await client.close();
  }
}

main();
