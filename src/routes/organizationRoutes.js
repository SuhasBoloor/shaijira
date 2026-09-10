const express = require('express');
const organizationController = require('../controllers/organizationController');
const { authenticateToken } = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, organizationController.createOrganization);
router.get('/', authenticateToken, organizationController.getUserOrganizations);

module.exports = router;