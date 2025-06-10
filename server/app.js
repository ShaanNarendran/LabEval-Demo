const express = require('express');
const cors = require('cors');
const executeRoute = require('./routes/execute');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/execute', executeRoute);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});