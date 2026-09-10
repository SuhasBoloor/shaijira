const { pgTable, uuid, primaryKey } = require('drizzle-orm/pg-core');
const { projects } = require('./projects');
const { users } = require('./users');

const project_members = pgTable("project_members", {
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
}, table => ({
    pk: primaryKey({ columns: [table.projectId, table.userId] }),
}));

module.exports = { project_members };
