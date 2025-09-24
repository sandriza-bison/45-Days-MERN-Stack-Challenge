// models/workExp.js
const mongoose = require("mongoose");

const workExpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    currentlyWorking: { type: Boolean, default: false },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WorkExp", workExpSchema);
