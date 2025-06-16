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