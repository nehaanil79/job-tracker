import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";

const router = express.Router();

const ALLOWED_FIELDS = ["company", "role", "status", "location", "jobUrl", "appliedDate", "notes"];

function pickAllowed(body) {
  const data = {};
  for (const field of ALLOWED_FIELDS) {
    if (body[field] !== undefined) {
      data[field] = body[field];
    }
  }
  return data;
}

function handleError(error, res) {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ error: messages.join(" ") });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: `Invalid value for ${error.path}.` });
  }
  console.error(error);
  return res.status(500).json({ error: "Something went wrong." });
}


router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    handleError(error, res);
  }
});


router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid job ID." });
  }
  try {
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    res.json(job);
  } catch (error) {
    handleError(error, res);
  }
});


router.post("/", async (req, res) => {
  try {
    const job = await Job.create(pickAllowed(req.body));
    res.status(201).json(job);
  } catch (error) {
    handleError(error, res);
  }
});


router.put("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid job ID." });
  }
  try {
    const job = await Job.findByIdAndUpdate(id, pickAllowed(req.body), {
      new: true,
      runValidators: true,
    });
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    res.json(job);
  } catch (error) {
    handleError(error, res);
  }
});


router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid job ID." });
  }
  try {
    const job = await Job.findByIdAndDelete(id);
    if (!job) {
      return res.status(404).json({ error: "Job not found." });
    }
    res.status(204).send();
  } catch (error) {
    handleError(error, res);
  }
});

export default router;