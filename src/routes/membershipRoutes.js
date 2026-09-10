const express = require('express');
const router = express.Router();
const membershipController = require('../controllers/membershipController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { requirePermission } = require('../middleware/requirePermission');

router.get('/', authenticateToken, membershipController.getMemberships);
router.post('/', authenticateToken, requirePermission('member:add'), membershipController.createMembership);
router.delete('/', authenticateToken, requirePermission('member:remove'), membershipController.deleteMembership);

module.exports = router;