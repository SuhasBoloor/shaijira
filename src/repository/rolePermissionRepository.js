const { role_permissions, permissions } = require('../models/schema')
const { db } = require('../config/db')
const { eq, and } = require('drizzle-orm')

async function assignPermissionToRole(roleId, permissionId) {
    const [assign] = await db.insert(role_permissions).values({roleId, permissionId}).returning()
    return assign
}

async function findPermissionsByRole(roleId) {
    const allRolePermission = await db.select().from(role_permissions).where(eq(role_permissions.roleId, roleId))
    return allRolePermission
}

async function findRolesByPermission(permissionId) {
    const allRolePermission = await db.select().from(role_permissions).where(eq(role_permissions.permissionId, permissionId))
    return allRolePermission
}

async function removePermissionFromRole(roleId, permissionId) {
    const deleteRolePermisison = await db.delete(role_permissions).where(and(eq(role_permissions.roleId, roleId), eq(role_permissions.permissionId, permissionId))).returning()
    return deleteRolePermisison
}

async function findPermissionNamesByRole(roleId){
    const row = await db.select({name: permissions.name}).from(role_permissions).innerJoin(permissions, eq(permissions.id, role_permissions.permissionId)).where(eq(role_permissions.roleId, roleId))
    return row.map(r=>r.name)
}

module.exports = { findPermissionNamesByRole, assignPermissionToRole, findPermissionsByRole, findRolesByPermission, removePermissionFromRole }