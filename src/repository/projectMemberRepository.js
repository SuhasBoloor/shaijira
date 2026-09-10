const { project_members } = require('../models/schema');
const { db } = require('../config/db');
const { eq, and } = require('drizzle-orm');

async function addMember(projectId, userId) {
    const [member] = await db.insert(project_members).values({ projectId, userId }).returning();
    return member;
}

async function removeMember(projectId, userId) {
    const [member] = await db.delete(project_members)
        .where(and(eq(project_members.projectId, projectId), eq(project_members.userId, userId)))
        .returning();
    return member;
}

async function isMember(projectId, userId) {
    const [member] = await db.select().from(project_members)
        .where(and(eq(project_members.projectId, projectId), eq(project_members.userId, userId)));
    return !!member;
}

async function findProjectsByUser(userId) {
    const rows = await db.select({ projectId: project_members.projectId })
        .from(project_members)
        .where(eq(project_members.userId, userId));
    return rows.map(r => r.projectId);
}

async function findMembersByProject(projectId) {
    const rows = await db.select().from(project_members)
        .where(eq(project_members.projectId, projectId));
    return rows;
}

module.exports = {
    addMember,
    removeMember,
    isMember,
    findProjectsByUser,
    findMembersByProject
};
