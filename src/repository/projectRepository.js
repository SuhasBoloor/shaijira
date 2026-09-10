const { projects } = require('../models/schema')
const { db } = require('../config/db')
const { eq, and } = require('drizzle-orm')

async function createProject(name, organizationId, description="") {
    const [project] = await db.insert(projects).values({name, organizationId, description}).returning()
    return project
}

async function findProjectById(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id))
    return project
}

async function findProjectsByOrg(organizationId) {
    const allOrgProjects = await db.select().from(projects).where(eq(projects.organizationId, organizationId))
    return allOrgProjects
}

async function findProjectByNameAndOrg(name, organizationId) {
    const [project] = await db.select().from(projects).where(and(eq(projects.name, name), eq(projects.organizationId, organizationId)))
    return project
}

async function updateProject(id, name, description="") {
    const [project] = await db.update(projects).set({name, description}).where(eq(projects.id, id)).returning()
    return project
}

async function deleteProject(id) {
    const [project] = await db.delete(projects).where(eq(projects.id, id)).returning()
    return project
}

module.exports = { createProject, findProjectById, findProjectsByOrg, findProjectByNameAndOrg,updateProject, deleteProject }