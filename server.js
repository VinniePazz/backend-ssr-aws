const express = require('express');

const app = express();

app.get('/api/signup', (req, res) => {
  res.json({ data: 'hello' });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
