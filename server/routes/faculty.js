const express = require("express");
const router = express.Router();
const Question = require("../models/question");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

// Add new question
router.post("/questions", async (req, res) => {
  try {
    const q = new Question(req.body);
    await q.save();
    res.json({ success: true, id: q._id });
  } catch (err) {
    console.error("Error adding question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
//Add bulk questions

router.post("/bulk", upload.single("file"), async (req, res) => {
  try {
    const jsonString = req.file.buffer.toString();
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid JSON: must be an array" });
    }

    await Question.insertMany(data);
    res.status(200).json({ message: "Bulk upload successful" });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ error: "Failed to upload questions" });
  }
});
// DELETE a question by ID
router.delete("/questions/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting question:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
// Get all questions
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;