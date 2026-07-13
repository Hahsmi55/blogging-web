require('dotenv').config();
const express = require('express');
const postRoutes = require('./routes/post.routes');
const tagsRoutes = require('./routes/tags.routes');
const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.use('/posts', postRoutes);
app.use('/tags', tagsRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

module.exports = app;   