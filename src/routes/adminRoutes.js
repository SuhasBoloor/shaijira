const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken } = require('../middleware/authenticateToken');

router.get('/stats', authenticateToken, adminController.getStats);
router.get('/overview', authenticateToken, adminController.getOverview);
router.post('/seed', authenticateToken, adminController.seedData);

module.exports = router;
