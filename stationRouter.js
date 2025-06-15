
// Sample Node.js Express router for station endpoints

const express = require('express');
const router = express.Router();

/**
 * In-memory storage for demo (replace with DB in production)
 */
let stations = [];
let nextId = 1;

// Create station
router.post('/stations', (req, res) => {
  const { name, address, city, state } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });
  const station = { id: String(nextId++), name, address, city, state };
  stations.push(station);
  res.status(201).json(station);
});

// Get all stations
router.get('/stations', (req, res) => {
  res.json(stations);
});

// Get station by ID
router.get('/stations/:stationId', (req, res) => {
  const station = stations.find(s => s.id === req.params.stationId);
  if (!station) return res.status(404).json({ error: "Not found" });
  res.json(station);
});

// Update station
router.put('/stations/:stationId', (req, res) => {
  const idx = stations.findIndex(s => s.id === req.params.stationId);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const { name, address, city, state } = req.body;
  stations[idx] = { ...stations[idx], name: name || stations[idx].name, address, city, state };
  res.json(stations[idx]);
});

// Delete station
router.delete('/stations/:stationId', (req, res) => {
  const idx = stations.findIndex(s => s.id === req.params.stationId);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  stations.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;

/** 
 * To use:
 * const express = require('express');
 * const app = express();
 * app.use(express.json());
 * app.use('/api', require('./stationRouter'));
 * app.listen(4000, ()=>console.log('API running'));
 */

