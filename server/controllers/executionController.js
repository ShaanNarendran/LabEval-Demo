const { validationResult } = require('express-validator');
const { runCodeInDocker } = require('../util/dockerRunner');

exports.handleExecution = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { language, source_code } = req.body;
    try {
      const output = await runCodeInDocker(language, source_code);
      res.json({ output: output || "No output received." });
    } catch (err) {
      if (err.isExecutionError) {
        return res.status(400).json({ error: err.message });
      }
      next(err); 
    }
};