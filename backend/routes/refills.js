
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/refills?stationId=... - List refills (Owner/Employee)
 */
router.get('/', (req, res) => {
  // TODO: List refills for station
  res.json([{ id: '900', stationId: req.query.stationId, fuelType: 'petrol', refillLitres: 150, refillTime: new Date().toISOString() }]);
});

/**
 * [RBAC] POST /api/refills - New refill (Employee)
 */
router.post('/', (req, res) => {
  // TODO: Validate, insert
  res.json({ id: '901', ...req.body });
});

module.exports = router;
