
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/sales?stationId=... - List sales (Owner/Employee)
 */
router.get('/', (req, res) => {
  // TODO: Query DB for sales
  res.json([{
    id: '500',
    stationId: req.query.stationId,
    nozzleId: '300',
    fuelType: 'petrol',
    litres: 10,
    amount: 1000,
    saleDatetime: new Date().toISOString(),
    source: 'manual'
  }]);
});

module.exports = router;
