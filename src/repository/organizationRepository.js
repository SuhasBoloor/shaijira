const {organizations, memberships} = require('../models/schema')
const {db} = require('../config/db')
const {eq} = require('drizzle-orm')

async function createOrganization(name){
    const [org] = await db.insert(organizations).values({name}).returning()
    return org
}

async function getOrganizationByName(name){
    const [org] = await db.select().from(organizations).where(eq(organizations.name, name))
    return org
}

async function getOrganizationById(id){
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id))
    return org
}

async function getOrganizationsByUser(userId) {
    const rows = await db.select({
        id: organizations.id,
        name: organizations.name,
        createdAt: organizations.createdAt
    })
    .from(memberships)
    .innerJoin(organizations, eq(memberships.organizationId, organizations.id))
    .where(eq(memberships.userId, userId));

    const map = new Map();
    for (const r of rows) map.set(r.id, r);
    return Array.from(map.values());
}

async function getAllOrganizations() {
    return await db.select().from(organizations);
}

async function updateOrg(id, name){
    const [org] = await db.update(organizations).set({name}).where(eq(organizations.id, id)).returning()
    return org
}

async function deleteOrg(id){
    const [org] = await db.delete(organizations).where(eq(organizations.id, id)).returning()
    return org
}

module.exports = {
    createOrganization, 
    getOrganizationById, 
    getOrganizationByName, 
    getOrganizationsByUser,
    getAllOrganizations,
    updateOrg, 
    deleteOrg
}