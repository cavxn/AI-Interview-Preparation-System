// server.js
const express = require('express');
const cors = require('cors');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', interviewRoutes); // All routes prefixed with /api

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
