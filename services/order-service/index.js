const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Order Service Running');
});

app.listen(3000, () => {
  console.log('Order service running on port 3000');
});

