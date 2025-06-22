const { validationResult } = require('express-validator');
const Question = require("../models/question");

// Handles creation of a new question.
exports.createQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const q = new Question(req.body);
    await q.save();
    res.status(201).json({ success: true, id: q._id });
  } catch (err) {
    next(err);
  }
};

// Handles bulk uploading questions from a JSON file.
exports.bulkUploadQuestions = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }
  if (req.file.mimetype !== 'application/json') {
    return res.status(400).json({ error: "Invalid file type. Please upload a JSON file." });
  }

  try {
    const jsonString = req.file.buffer.toString();
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data)) {
      return res.status(400).json({ error: "Invalid JSON format: must be an array of questions." });
    }
    
    await Question.insertMany(data);
    res.status(201).json({ message: "Bulk upload successful" });
  } catch (error) {
    next(error);
  }
};

// Handles deleting a question by its ID.
exports.deleteQuestion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
    
  try {
    const result = await Question.findByIdAndDelete(req.params.id);
    if (!result) {
        return res.status(404).json({ success: false, error: 'Question not found' });
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

// Handles fetching all questions.
exports.getAllQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    next(err);
  }
};