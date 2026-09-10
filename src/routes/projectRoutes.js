const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { requirePermission } = require('../middleware/requirePermission');

router.post('/', authenticateToken, requirePermission('project:create'), projectController.createProject);
router.get('/', authenticateToken, projectController.getProjectbyOrg);
router.get('/:id', authenticateToken, projectController.getProjectById);
router.put('/:id', authenticateToken, requirePermission('project:update'), projectController.updateProject);
router.delete('/:id', authenticateToken, requirePermission('project:delete'), projectController.deleteProject);

// Project Member Management Routes
router.post('/:id/members', authenticateToken, requirePermission('project:update'), projectController.addMember);
router.delete('/:id/members/:userId', authenticateToken, requirePermission('project:update'), projectController.removeMember);

module.exports = router;
