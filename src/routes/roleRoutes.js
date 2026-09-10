const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { requirePermission } = require('../middleware/requirePermission');

router.get('/', authenticateToken, roleController.getRoles);
router.post('/', authenticateToken, requirePermission('member:add'), roleController.createRole);
router.get('/permissions', authenticateToken, roleController.getAllPermissions);

module.exports = router;
