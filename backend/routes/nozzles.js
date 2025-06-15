
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/nozzles?pumpId=...
 */
router.get('/', (req, res) => {
  // TODO: Query DB for pump's nozzles
  res.json([
    { id: '300', pumpId: req.query.pumpId, label: 'Nozzle 1', fuelType: 'petrol' }
  ]);
});

/**
 * [RBAC] POST /api/nozzles - Create nozzle (Owner only)
 */
router.post('/', (req, res) => {
  // TODO: Validate, insert, associate with pump
  res.json({ id: '301', ...req.body });
});

module.exports = router;
