const taskService = require('../service/taskService');

async function createTask(req, res) {
    try {
        const { title, projectId, description, assigneeId, status } = req.body;
        if(!title) throw new Error("title is requried")
        if(!projectId) throw new Error("projectId is requried")
        const task = await taskService.createTask(title, projectId, description, assigneeId, status)
        return res.status(201).json({ 
            message: "Task created", 
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getTaskById(req, res) {
    try {
        const { id } = req.params;
        const task = await taskService.getTaskById(id)
        return res.status(200).json({ 
            message:"Task retrived",
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getTaskByProject(req, res) {
    try {
        const { projectId } = req.params;
        const task  = await taskService.getTaskByProject(projectId)
        return res.status(200).json({ 
            message:"Task retrived",
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getTasksByAssignee(req, res) {
    try {
        const { assigneeId } = req.params;
        const task = await  taskService.getTasksByAssignee(assigneeId)
        return res.status(200).json({ 
            message:"Task retrived",
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const task = await taskService.updateTask(id, req.body)
        return res.status(200).json({ 
            message: "Task updated", 
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deleteTask(req, res) {
    try {
        const { id } = req.params;
        const task = await taskService.deleteTask(id)
        return res.status(200).json({ 
            message: "Task deleted", 
            data: task 
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createTask,
    getTaskById,
    getTaskByProject,
    getTasksByAssignee,
    updateTask,
    deleteTask
};