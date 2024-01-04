// Create web server application
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Use body-parser to parse application/x-www-form-urlencoded format
app.use(bodyParser.urlencoded({ extended: false }));

// Use body-parser to parse application/json format
app.use(bodyParser.json());

// Use express.static() to serve static files
app.use(express.static('public'));

// Use fs.readFile() to read comments.json file
const readComments = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./comments.json', 'utf8', (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
};

// Use fs.writeFile() to write comments to comments.json file
const writeComments = (comments) => {
  return new Promise((resolve, reject) => {
    fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
      if (err) reject(err);
      resolve();
    });
  });
};

// Use app.get() to handle GET requests sent to /comments
app.get('/comments', async (req, res) => {
  try {
    const comments = await readComments();
    res.json(comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Use app.post() to handle POST requests sent to /comments
app.post('/comments', async (req, res) => {
  try {
    const comments = await readComments();
    comments.push(req.body);
    await writeComments(comments);
    res.status(201).json(comments);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Use app.delete() to handle DELETE requests sent to /comments
app.delete('/comments', async (req, res) => {
  try {
    const comments = await readComments();
    const index = comments.findIndex((comment) => comment.id === req.body.id);
    comments.splice(index, 1);
    await writeComments(comments);
    res.status(204).send();
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
