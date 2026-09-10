const { roles } = require('../models/schema')
const { db } = require('../config/db')
const { eq, and } = require('drizzle-orm')

async function createRole(name, organizationId) {
    const [role] = await db.insert(roles).values({name, organizationId}).returning()
    return role
}

async function findRoleById(id) {
    const [role] = await db.select().from(roles).where(eq(roles.id, id))
    return role
}

async function findRolesByOrg(organizationId) {
    const role = await db.select().from(roles).where(eq(roles.organizationId, organizationId))
    return role
}

async function findRoleByNameAndOrg(name, organizationId) {
    const [role] = await db.select().from(roles).where(and(eq(roles.name, name), eq(roles.organizationId, organizationId)))
    return role
}

async function updateRole(id, name) {
    const [role] = await db.update(roles).set({name}).where(eq(roles.id, id)).returning()
    return role
}

async function deleteRole(id) {
    const [role] = await db.delete(roles).where(eq(roles.id, id)).returning()
    return role
}

module.exports = { createRole, findRoleById, findRolesByOrg, findRoleByNameAndOrg, updateRole, deleteRole }