const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Payment Service Running');
});

app.listen(3000, () => {
  console.log('Payment service running on port 3000');
});
