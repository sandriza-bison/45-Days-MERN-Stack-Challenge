// app.js
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const WorkExp = require("./models/workExp");

const app = express();
connectDB();
app.use(express.json());

// CREATE
app.post("/api/work", async (req, res) => {
  try {
    const work = await WorkExp.create(req.body);
    res.status(201).json(work);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ (all + filters)
app.get("/api/work", async (req, res) => {
  try {
    const filter = {};
    if (req.query.company) filter.company = new RegExp(req.query.company, "i");
    if (req.query.currentlyWorking)
      filter.currentlyWorking = req.query.currentlyWorking === "true";
    const work = await WorkExp.find(filter);
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ single
app.get("/api/work/:id", async (req, res) => {
  try {
    const work = await WorkExp.findById(req.params.id);
    if (!work) return res.status(404).json({ error: "Not found" });
    res.json(work);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
app.put("/api/work/:id", async (req, res) => {
  try {
    const work = await WorkExp.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!work) return res.status(404).json({ error: "Not found" });
    res.json(work);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
app.delete("/api/work/:id", async (req, res) => {
  try {
    const work = await WorkExp.findByIdAndDelete(req.params.id);
    if (!work) return res.status(404).json({ error: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
