const express = require('express');
const app = express();
const port = 3002;
const commentsRoutes = require('./routes/comments.routes');

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/comments', commentsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;