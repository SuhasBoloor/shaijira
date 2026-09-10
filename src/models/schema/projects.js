const {pgTable, uuid, text, timestamp, uniqueIndex} = require('drizzle-orm/pg-core')
const { organizations } = require('./organizations')

const projects = pgTable("projects", {
     id: uuid("id").primaryKey().defaultRandom(),
     name: text("name").notNull(),
     organizationId: uuid("organization_id").notNull().references(() => organizations.id),
     description: text("description"),
     createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => ({
  uniqueOrgProjectName: uniqueIndex("unique_org_project_name").on(table.organizationId, table.name),
}))

module.exports = {projects}