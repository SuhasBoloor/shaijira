const {pgTable, integer, primaryKey} = require('drizzle-orm/pg-core')
const { roles } = require('./roles')
const { permissions } = require('./permissions')

const role_permissions = pgTable("role_permissions", {
    roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: integer("permission_id").notNull().references(() => permissions.id, { onDelete: 'cascade' })
}, table => ({
    pk: primaryKey({columns: [table.roleId, table.permissionId]})
})
)

module.exports = {role_permissions}