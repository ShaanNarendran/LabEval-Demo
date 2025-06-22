const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/execute', require('./routes/execute'));
app.use('/faculty', require('./routes/faculty'));
app.use('/student', require('./routes/student'));

// --- Static File Serving ---
app.use(express.static(path.join(__dirname, '../client')));
//using * here will break the code so a necessary change was made because of express 5
app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// --- Database Connection and Server Start ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });