const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authenticateToken');
const { requirePermission } = require('../middleware/requirePermission');

router.post('/', authenticateToken, requirePermission('task:create'), taskController.createTask);
router.get('/project/:projectId', authenticateToken, taskController.getTaskByProject);
router.get('/assignee/:assigneeId', authenticateToken, taskController.getTasksByAssignee);
router.get('/:id', authenticateToken, taskController.getTaskById);
router.put('/:id', authenticateToken, requirePermission('task:update'), taskController.updateTask);
router.delete('/:id', authenticateToken, requirePermission('task:delete'), taskController.deleteTask);

module.exports = router;