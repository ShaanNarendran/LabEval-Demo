const express = require('express');
const { runCodeInDocker } = require('../util/dockerRunner');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log("Received POST /execute request");
  const { language, source_code } = req.body;
  try {
    const output = await runCodeInDocker(language, source_code);
    res.json({ output });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;