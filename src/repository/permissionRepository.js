const { permissions } = require('../models/schema')
const { db } = require('../config/db')
const { eq } = require('drizzle-orm')

async function createPermission(name, description="") {
    const [permission] = await db.insert(permissions).values({name, description}).returning()
    return permission
}

async function findPermissionById(id) {
    const [permission] = await db.select().from(permissions).where(eq(permissions.id, id))
    return permission
}

async function findPermissionByName(name) {
    const [permission] = await db.select().from(permissions).where(eq(permissions.name, name))
    return permission
}

async function findAllPermissions() {
    const allPermission = await db.select().from(permissions)
    return allPermission
}

async function updatePermission(id, name, description="") {
    const [permission] = await db.update(permissions).set({name, description}).where(eq(permissions.id, id)).returning()
    return permission
}

async function deletePermission(id) {
    const [permission] = await db.delete(permissions).where(eq(permissions.id, id)).returning()
    return permission
}

module.exports = { createPermission, findPermissionById, findPermissionByName, findAllPermissions, updatePermission, deletePermission }