import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
const PORT = 5000;

app.use(express.json());

// MongoDB setup
const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);
const dbName = "myDatabase";

async function main() {
  await client.connect();
  console.log("✅ Connected to MongoDB");

  const db = client.db(dbName);
  const projects = db.collection("projects");

  // Helper function to validate project data
  const validateProject = (data) => {
    if (!data.name || typeof data.name !== "string") return "Name is required and should be a string";
    if (!data.description || typeof data.description !== "string") return "Description is required and should be a string";
    return null;
  };

  // CREATE: Add a new project
  app.post("/api/projects", async (req, res) => {
    try {
      const error = validateProject(req.body);
      if (error) return res.status(400).json({ error });

      const result = await projects.insertOne(req.body);
      res.status(201).json({ message: "Project added", projectId: result.insertedId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ: Get all projects
  app.get("/api/projects", async (req, res) => {
    try {
      const allProjects = await projects.find().toArray();
      res.status(200).json(allProjects);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // READ: Get a single project by ID
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format" });

      const project = await projects.findOne({ _id: new ObjectId(id) });
      if (!project) return res.status(404).json({ error: "Project not found" });

      res.status(200).json(project);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // UPDATE: Update a project by ID
  app.put("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format" });

      const error = validateProject(req.body);
      if (error) return res.status(400).json({ error });

      const filter = { _id: new ObjectId(id) };
      const updateDoc = { $set: req.body };
      const result = await projects.findOneAndUpdate(filter, updateDoc, { returnDocument: "after" });

      if (!result.value) return res.status(404).json({ error: "Project not found" });

      res.status(200).json({ message: "Project updated", project: result.value });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // DELETE: Delete a project by ID
  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) return res.status(400).json({ error: "Invalid ID format" });

      const filter = { _id: new ObjectId(id) };
      const result = await projects.deleteOne(filter);

      if (result.deletedCount === 0) return res.status(404).json({ error: "Project not found" });

      res.status(200).json({ message: "Project deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Start the server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main().catch(err => {
  console.error("Failed to start server:", err);
});
