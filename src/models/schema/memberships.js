const {pgTable, integer, uuid, timestamp, uniqueIndex, primaryKey} = require('drizzle-orm/pg-core')
const { roles } = require('./roles')
const { organizations } = require('./organizations')
const { users } = require('./users')

const memberships = pgTable("memberships", {
    roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: 'cascade' }),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' })
}, table =>({
    pk: primaryKey({columns: [table.roleId, table.organizationId, table.userId]})

}))

module.exports = {memberships}