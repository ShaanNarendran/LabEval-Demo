const express = require('express');
const cors = require('cors');
const executeRoute = require('./routes/execute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/execute', executeRoute);

const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const mongoose = require("mongoose");
require('dotenv').config();
app.use(express.json());  // for parsing JSON request bodies

// Connect to local MongoDB or Atlas
mongoose.connect("mongodb+srv://labevaluser:db11@cluster0.3aj3w4z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const facultyRoutes = require('./routes/faculty');
app.use("/faculty", require("./routes/faculty"));
const studentRoutes=require("./routes/student");
app.use("/student", require("./routes/student")); 

