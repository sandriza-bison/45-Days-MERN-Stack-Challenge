const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// MongoDB setup
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "myDatabase";

async function main() {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db(dbName);
  const projects = db.collection("projects");

  // CREATE - Add a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const { name, description, status } = req.body;
      if (!name) return res.status(400).json({ error: "Project name is required" });

      const newProject = { name, description, status: status || "in progress", createdAt: new Date() };
      const result = await projects.insertOne(newProject);
      res.status(201).json({ message: "Project added", projectId: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ - Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await projects.find().toArray();
      res.status(200).json(allProjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ - Get single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await projects.findOne({ _id: new ObjectId(req.params.id) });
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.status(200).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE - Update a project by ID
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const updatedProject = await projects.findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: req.body },
        { returnDocument: "after" }
      );
      if (!updatedProject.value) return res.status(404).json({ error: "Project not found" });
      res.status(200).json({ message: "Project updated", project: updatedProject.value });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE - Delete a project by ID
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const result = await projects.deleteOne({ _id: new ObjectId(req.params.id) });
      if (result.deletedCount === 0) return res.status(404).json({ error: "Project not found" });
      res.status(200).json({ message: "Project deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start server
  app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  console.log("MongoDB connection closed");
  process.exit(0);
});

main().catch(console.error);
