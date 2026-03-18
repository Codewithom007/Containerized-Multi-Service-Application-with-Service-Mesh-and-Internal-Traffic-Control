const express = require('express');
const axios   = require('axios');
const app     = express();
app.use(express.json());
 
const PORT           = process.env.PORT              || 3003;
const VERSION        = process.env.VERSION           || 'v1';
const ORDER_SVC_URL  = process.env.ORDER_SERVICE_URL || 'http://order-service:3002';
 
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'payment-service', version: VERSION });
});
 
// Get all payments
app.get('/payments', (req, res) => {
  res.json({
    service: 'payment-service',
    version: VERSION,
    payments: [
      { id: 'PAY-001', orderId: 101, amount: 999,  status: 'SUCCESS' },
      { id: 'PAY-002', orderId: 102, amount: 79,   status: 'SUCCESS' }
    ]
  });
});
 
// Process a new payment
app.post('/payments', async (req, res) => {
  const { orderId, amount } = req.body;
 
  // Validate required fields
  if (!orderId || !amount) {
    return res.status(400).json({ error: 'orderId and amount are required' });
  }
 
  try {
    // Call order-service to verify the order exists
    await axios.get(`${ORDER_SVC_URL}/orders/${orderId}`, { timeout: 3000 });
 
    // Order verified — process payment
    res.json({
      paymentId:  `PAY-${Date.now()}`,
      orderId,
      amount,
      status:     'SUCCESS',
      processedAt: new Date().toISOString(),
      version:    VERSION
    });
  } catch (err) {
    res.status(503).json({
      error:   'Cannot process payment',
      reason:  'Order service unavailable'
    });
  }
});
 
app.listen(PORT, () => console.log(`Payment Service ${VERSION} on port ${PORT}`));
