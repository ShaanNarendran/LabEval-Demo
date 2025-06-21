const express = require('express');
const { runCodeInDocker } = require('../util/dockerRunner');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Received POST /execute request");
  const { language, source_code } = req.body;

  if (!language || !source_code) {
    return res.status(400).json({ error: "Missing language or source_code in request." });
  }

  try {
    const output = await runCodeInDocker(language, source_code);

    res.json({ output: output || "No output received." });

  } catch (err) {
    console.error("Docker execution failed:", err);

    // Send full stderr message to frontend for display
    res.status(500).json({
      error: err.message || "Unknown error occurred during Docker execution."
    });
  }
});

module.exports = router;