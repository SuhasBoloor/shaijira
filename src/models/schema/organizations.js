const {pgTable, text, uuid, timestamp} = require('drizzle-orm/pg-core')

const organizations = pgTable("organizations",{
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

module.exports = {organizations}