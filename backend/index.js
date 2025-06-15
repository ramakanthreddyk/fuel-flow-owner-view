
// Minimal Express app that mounts all modular entity routers
const express = require('express');
const app = express();
app.use(express.json());

// Example: JWT Auth Middleware placeholder
// const authMiddleware = require('./middleware/auth');

// Mount entity routes
app.use('/api/users', require('./routes/users'));
app.use('/api/stations', require('./routes/stations'));
app.use('/api/pumps', require('./routes/pumps'));
app.use('/api/nozzles', require('./routes/nozzles'));
app.use('/api/sales', require('./routes/sales'));
app.use('/api/readings', require('./routes/readings'));
app.use('/api/tenders', require('./routes/tenders'));
app.use('/api/refills', require('./routes/refills'));
// app.use('/api/auth', require('./routes/auth')); // For custom auth endpoints

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));

