
const {pgTable, serial, text, timestamp} = require('drizzle-orm/pg-core')

const permissions = pgTable("permissions", {
    id: serial("id").primaryKey(),
    name: text("name").unique().notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow().notNull()
})

module.exports = {permissions}