const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// Get question by ID
router.get("/question/:id", async (req, res) => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ error: "Question not found" });
    res.json(q);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all questions (if needed for dropdown)
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;