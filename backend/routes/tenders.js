
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/tenders?stationId=... - List tenders (Owner)
 */
router.get('/', (req, res) => {
  // TODO: List tenders for station
  res.json([{ id: '700', stationId: req.query.stationId, tenderType: 'cash', amount: 1000, entryDate: '2024-06-15' }]);
});

/**
 * [RBAC] POST /api/tenders - New tender entry (Owner/Employee)
 */
router.post('/', (req, res) => {
  // TODO: Validate, insert
  res.json({ id: '701', ...req.body });
});

module.exports = router;
