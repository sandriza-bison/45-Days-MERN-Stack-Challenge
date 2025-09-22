const express = require('express');
const app = express();

// Resume data arrays
const projects = [
 { 
    id: 1,
    title: "Smart Expense Tracker",
    technologies: ["React", "Node.js", "MongoDB"],
    description: "Tracks daily expenses, generates charts, and syncs across devices."
  },
  { 
    id: 2,
    title: "Real-Time Chat App",
    technologies: ["Express", "Socket.io", "MongoDB"],
    description: "WebSocket-powered group chat with emoji support and typing indicators."
  },
  { 
    id: 3,
    title: "AI Recipe Recommender",
    technologies: ["Next.js", "OpenAI API"],
    description: "Suggests recipes based on ingredients you already have at home."
  }
];

const workExperience = [
   {
    id: 1,
    company: "CloudSphere Solutions",
    position: "Backend Developer",
    years: "2023–Present",
    summary: "Built scalable REST APIs and optimized database queries for a SaaS analytics platform."
  },
   {
    id: 3,
    company: "Open Source Community",
    position: "Contributor",
    years: "2021–Present",
    summary: "Contributed bug fixes and new features to popular Node.js and React libraries."
  }
];

// GET /api/projects - Return all projects
app.get('/api/projects', (req, res) => {
  res.json({ success: true, count: projects.length, data: projects });
});

// GET /api/experience - Return work experience
app.get('/api/experience', (req, res) => {
  res.json({ success: true, count: workExperience.length, data: workExperience });
});

//  GET /api/projects/:id - Return single project by ID
app.get('/api/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return res.status(404).json({
      success: false,
      error: 'Project not found'
    });
  }

  res.json({ success: true, data: project });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});