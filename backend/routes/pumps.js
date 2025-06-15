
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/pumps?stationId=...
 */
router.get('/', (req, res) => {
  // TODO: Query DB for station's pumps
  res.json([{ id: '200', stationId: req.query.stationId, label: 'Pump 1' }]);
});

/**
 * [RBAC] POST /api/pumps - Create pump (Owner only)
 */
router.post('/', (req, res) => {
  // TODO: Validate & insert to DB
  res.json({ id: '201', ...req.body });
});

module.exports = router;
