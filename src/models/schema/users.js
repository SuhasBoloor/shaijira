const {pgTable, text, uuid, varchar, timestamp, boolean} = require('drizzle-orm/pg-core')

const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    password: varchar("password").notNull(),
    isSuperAdmin:boolean('is_superadmin').default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

module.exports = {users}