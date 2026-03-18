// Load the Express web framework
const express = require('express');
const app = express();
app.use(express.json());
 
// Read port and version from environment variables
// If not set, use defaults
const PORT    = process.env.PORT    || 3001;
const VERSION = process.env.VERSION || 'v1';
 
// ── Route 1: Health Check ──────────────────────────────
// Kubernetes will call this to know if the app is alive
app.get('/health', (req, res) => {
  res.json({
    status:  'healthy',
    service: 'user-service',
    version: VERSION
  });
});
 
// ── Route 2: Get All Users ────────────────────────────
app.get('/users', (req, res) => {
  res.json({
    service: 'user-service',
    version: VERSION,
    users: [
      { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin'  },
      { id: 2, name: 'Bob Smith',     email: 'bob@example.com',   role: 'user'   },
      { id: 3, name: 'Carol White',   email: 'carol@example.com', role: 'user'   }
    ]
  });
});
 
// ── Route 3: Get Single User ──────────────────────────
app.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const users  = { 1: 'Alice Johnson', 2: 'Bob Smith', 3: 'Carol White' };
  if (!users[userId]) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ id: userId, name: users[userId], version: VERSION });
});
 
// Start the server
app.listen(PORT, () => {
  console.log(`User Service ${VERSION} is running on port ${PORT}`);
});
