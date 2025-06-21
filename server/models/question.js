const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  expected: { type: String, required: true }
});

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  functionSignature: { type: String },
  precode: { type: String },
  languages: [String],  // e.g., ["cpp", "python"]
  testCases: [testCaseSchema]
});

module.exports = mongoose.model("Question", questionSchema);