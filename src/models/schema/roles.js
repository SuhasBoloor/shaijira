const {pgTable, serial, uuid, text, timestamp, uniqueIndex} = require('drizzle-orm/pg-core')
const { organizations } = require('./organizations')

const roles = pgTable("roles", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    organizationId: uuid("organization_id").notNull().references(() => organizations.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  uniqueMembership: uniqueIndex('unique_user_org_role').on(table.name, table.organizationId),
}))

module.exports = {roles}