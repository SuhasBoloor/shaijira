const { memberships, organizations } = require('../models/schema')
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

async function deleteMembership(userId, organizationId, roleId) {
    const [membership] = await db.delete(memberships).where(and(eq(memberships.userId, userId), eq(memberships.organizationId, organizationId), eq(memberships.roleId, roleId))).returning()
    return membership 
}

module.exports = { createMembership, findByUserId, findByUserAndOrg, deleteMembership }