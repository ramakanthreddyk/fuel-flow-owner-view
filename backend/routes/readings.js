
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/readings?nozzleId=... - List readings for nozzle
 */
router.get('/', (req, res) => {
  // TODO: Query DB for readings
  res.json([{
    id: '800',
    nozzleId: req.query.nozzleId,
    cumulativeVolume: 100,
    recordedAt: new Date().toISOString(),
    method: 'manual'
  }]);
});

/**
 * [RBAC] POST /api/readings - New reading (Manual or OCR) (Employee)
 */
router.post('/', (req, res) => {
  // TODO: Validate, insert into DB
  res.json({ id: '801', ...req.body });
});

module.exports = router;
