const { memberships, organizations, users, roles } = require('../models/schema')
const { db } = require('../config/db')
const { eq, and } = require('drizzle-orm')

async function createMembership(userId, organizationId, roleId) {
    const [membership] = await db.insert(memberships).values({ userId, organizationId, roleId }).returning()
    return membership
}

async function findByUserId(userId) {
    const memebership = await db.select().from(memberships).where(eq(memberships.userId, userId))
    return memebership
}

async function findByUserAndOrg(userId, organizationId) {
    const [memebership] = await db.select().from(memberships).where(and(eq(memberships.userId, userId), eq(memberships.organizationId, organizationId)))
    return memebership
}

async function getMembersByOrg(organizationId) {
    const list = await db.select({
        userId: users.id,
        username: users.username,
        isSuperAdmin: users.isSuperAdmin,
        roleId: roles.id,
        roleName: roles.name,
        organizationId: memberships.organizationId
    })
    .from(memberships)
    .innerJoin(users, eq(users.id, memberships.userId))
    .innerJoin(roles, eq(roles.id, memberships.roleId))
    .where(eq(memberships.organizationId, organizationId))
    return list
}

async function deleteMembership(userId, organizationId, roleId) {
    let condition = and(eq(memberships.userId, userId), eq(memberships.organizationId, organizationId));
    if (roleId) {
        condition = and(condition, eq(memberships.roleId, roleId));
    }
    const [membership] = await db.delete(memberships).where(condition).returning()
    return membership 
}

module.exports = { createMembership, findByUserId, findByUserAndOrg, getMembersByOrg, deleteMembership }