const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
require('dotenv').config(); // Make sure dotenv is configured at the top

const executeRoute = require('./routes/execute');
const facultyRoutes = require('./routes/faculty');
const studentRoutes = require("./routes/student");
const errorHandler = require('./middleware/errorHandler'); // Import the error handler

const app = express();
app.use(cors());
app.use(express.json());

// Use the MongoDB connection string from environment variables
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("MongoDB connection string (MONGO_URI) not found in environment variables. Please set it in your .env file.");
    process.exit(1); // Exit if the connection string is not set
}

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit on connection failure
    });

// Routes
app.use('/execute', executeRoute);
app.use("/faculty", facultyRoutes);
app.use("/student", studentRoutes);

// Centralized error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

