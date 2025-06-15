
const express = require('express');
const router = express.Router();

/**
 * [RBAC] GET /api/users - List users (Superadmin/Owner only)
 */
router.get('/', (req, res) => {
  // TODO: Use DB connector - fetch all users with roles
  res.json([{ id: '1', name: 'Test User', email: 'test@email.com', role: 'owner' }]);
});

/**
 * [RBAC] POST /api/users - Create user (Superadmin only)
 */
router.post('/', (req, res) => {
  // TODO: Validate, hash password, insert into DB, send email
  res.json({ id: '2', ...req.body });
});

module.exports = router;
