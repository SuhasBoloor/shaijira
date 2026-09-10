const {pgTable, uuid, text, timestamp, pgEnum} = require('drizzle-orm/pg-core')
const { projects } = require('./projects');
const { users } = require('./users');

const statusEnum = pgEnum("task_status", ["todo", "in_progress", "done"]);

const tasks = pgTable("tasks", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    description: text("description"),
    projectId: uuid("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
    assigneeId: uuid("assignee_id").references(() => users.id, { onDelete: 'set null' }),
    status: statusEnum("status").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
})

module.exports = {tasks}