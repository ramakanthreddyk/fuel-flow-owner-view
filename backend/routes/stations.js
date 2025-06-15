
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/stations - List stations (Owner: theirs, Employee: assigned only)
 */
router.get('/', (req, res) => {
  // TODO: Fetch from DB using appropriate filters
  res.json([{ id: '100', name: 'Example Station', address: '123 Main St' }]);
});

/**
 * [RBAC] POST /api/stations - Create station (Owner only)
 */
router.post('/', (req, res) => {
  // TODO: Validate ownership, insert new station with ownerId
  res.json({ id: '101', ...req.body });
});

module.exports = router;
