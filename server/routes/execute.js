const express = require('express');
const { body, validationResult } = require('express-validator'); 
const { runCodeInDocker } = require('../util/dockerRunner');
const router = express.Router();

const SUPPORTED_LANGUAGES = ['c', 'cpp', 'python', 'java'];

router.post(
  '/',
  // 1. Validation Middleware: This runs before the main route logic.
  [
    body('language').isIn(SUPPORTED_LANGUAGES).withMessage('Invalid or unsupported language.'),
    body('source_code').not().isEmpty().withMessage('Source code cannot be empty.')
  ],
  // 2. Main Route Handler
  async (req, res, next) => {
    // 3. Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, return a 400 status with the error details
      return res.status(400).json({ errors: errors.array() });
    }

    const { language, source_code } = req.body;

    try {
      // 4. If validation passes, run the code
      const output = await runCodeInDocker(language, source_code);
      res.json({ output: output || "No output received." });
    } catch (err) {
      // 5. Handle errors from code execution
      if (err.isExecutionError) {
        return res.status(400).json({ error: err.message });
      }
      // 6. Pass any other server errors to the central handler
      next(err); 
    }
  }
);

module.exports = router;