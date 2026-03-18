const express = require('express');
const axios   = require('axios');  // For making HTTP calls to other services
const app     = express();
app.use(express.json());
 
const PORT         = process.env.PORT             || 3002;
const VERSION      = process.env.VERSION          || 'v1';
// This URL comes from the Kubernetes ConfigMap we create later
const USER_SVC_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
 
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'order-service', version: VERSION });
});
 
app.get('/orders', async (req, res) => {
  try {
    // Call user-service to get user details
    // This is service-to-service communication!
    const userResponse = await axios.get(`${USER_SVC_URL}/users/1`, {
      timeout: 3000  // Give up after 3 seconds
    });
    const user = userResponse.data;
 
    res.json({
      service: 'order-service',
      version: VERSION,
      orders: [
        { id: 101, product: 'Laptop',   price: 999,  status: 'delivered', user },
        { id: 102, product: 'Keyboard', price: 79,   status: 'shipped',   user },
        { id: 103, product: 'Monitor',  price: 349,  status: 'processing',user }
      ]
    });
  } catch (err) {
    // If user-service is down, return an error instead of crashing
    res.status(503).json({
      error:   'User service unavailable',
      message: err.message
    });
  }
});
 
app.get('/orders/:id', (req, res) => {
  res.json({
    id:      parseInt(req.params.id),
    product: `Product-${req.params.id}`,
    status:  'confirmed',
    version: VERSION
  });
});
 
app.listen(PORT, () => console.log(`Order Service ${VERSION} on port ${PORT}`));
