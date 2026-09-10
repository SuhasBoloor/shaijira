const projectRepository = require('../repository/projectRepository');
const projectMemberRepository = require('../repository/projectMemberRepository');

async function createProject(name, organizationId, description = "", creatorId = null) {
    const existing = await projectRepository.findProjectByNameAndOrg(name, organizationId);
    if (existing) throw new Error("Project name already exists");

    const newProject = await projectRepository.createProject(name, organizationId, description);

    // Automatically add the creator as the first project member
    if (creatorId) {
        await projectMemberRepository.addMember(newProject.id, creatorId);
    }

    return newProject;
}

async function getProjectsByOrg(organizationId, userId = null, isSuperAdmin = false) {
    const allProjects = await projectRepository.findProjectsByOrg(organizationId);

    // SuperAdmin sees all projects in the org
    if (isSuperAdmin || !userId) {
        return allProjects;
    }

    // Regular members only see projects they are assigned to
    const userProjectIds = await projectMemberRepository.findProjectsByUser(userId);
    return allProjects.filter(p => userProjectIds.includes(p.id));
}

async function getProjectsById(id, userId = null, isSuperAdmin = false) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new Error("Project not found");

    if (!isSuperAdmin && userId) {
        const isMember = await projectMemberRepository.isMember(id, userId);
        if (!isMember) throw new Error("Access denied: Not a member of this project");
    }

    return project;
}

async function updateProject(id, name, description) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new Error("Project does not exist");

    const projectName = await projectRepository.findProjectByNameAndOrg(name, project.organizationId);
    if (projectName && projectName.id !== id) throw new Error("Project name already exists");

    const update = await projectRepository.updateProject(id, name, description);
    return update;
}

async function deleteProject(id) {
    const project = await projectRepository.findProjectById(id);
    if (!project) throw new Error("Project does not exist");

    const remove = await projectRepository.deleteProject(id);
    return remove;
}

async function addProjectMember(projectId, userId) {
    const project = await projectRepository.findProjectById(projectId);
    if (!project) throw new Error("Project not found");

    return await projectMemberRepository.addMember(projectId, userId);
}

async function removeProjectMember(projectId, userId) {
    return await projectMemberRepository.removeMember(projectId, userId);
}

module.exports = {
    createProject,
    getProjectsByOrg,
    getProjectsById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember
};
