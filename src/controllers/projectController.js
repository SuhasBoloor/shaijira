const projectService = require('../service/projectService');

async function createProject(req, res) {
    const organizationId = req.headers['organization-id'] || req.headers.organizationid || req.body.organizationId;
    const { name, description } = req.body;

    try {
        if (!organizationId) throw new Error("Organization ID is required");
        if (!name) throw new Error("Name is required");

        const project = await projectService.createProject(name, organizationId, description, req.user?.userId);
        return res.status(201).json({
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getProjectbyOrg(req, res) {
    const organizationId = req.headers['organization-id'] || req.query.organizationId;

    try {
        if (!organizationId) throw new Error("Organization ID is required");

        const projects = await projectService.getProjectsByOrg(
            organizationId,
            req.user?.userId,
            req.user?.isSuperAdmin
        );
        return res.status(200).json({
            message: "Projects retrieved",
            data: projects
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getProjectById(req, res) {
    const { id } = req.params;

    try {
        const project = await projectService.getProjectsById(
            id,
            req.user?.userId,
            req.user?.isSuperAdmin
        );
        return res.status(200).json({
            message: "Project retrieved",
            data: project
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function updateProject(req, res) {
    const { id } = req.params;
    const { name, description } = req.body;

    try {
        if (!name) throw new Error("Name is required");

        const project = await projectService.updateProject(id, name, description);
        return res.status(200).json({
            message: "Project updated successfully",
            data: project
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deleteProject(req, res) {
    const { id } = req.params;

    try {
        const project = await projectService.deleteProject(id);
        return res.status(200).json({
            message: "Project deleted",
            data: project
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function addMember(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
        if (!userId) throw new Error("User ID is required");
        const member = await projectService.addProjectMember(id, userId);
        return res.status(201).json({
            message: "Member added to project successfully",
            data: member
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function removeMember(req, res) {
    const { id, userId } = req.params;

    try {
        const removed = await projectService.removeProjectMember(id, userId);
        return res.status(200).json({
            message: "Member removed from project successfully",
            data: removed
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = {
    createProject,
    getProjectbyOrg,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember
};
