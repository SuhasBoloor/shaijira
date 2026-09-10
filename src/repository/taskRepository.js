const { tasks } = require('../models/schema')
const { db } = require('../config/db')
const { eq, and } = require('drizzle-orm')

async function createTask(title, projectId, description, assigneeId, status) {
    const [task] = await db.insert(tasks).values({title, projectId, description, assigneeId, status}).returning()
    return task
}

async function findTaskById(id) {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id))
    return task
}

async function findTasksByProject(projectId) {
    const task = await db.select().from(tasks).where(eq(tasks.projectId, projectId))
    return task
}

async function findTasksByAssignee(assigneeId) {
    const task = await db.select().from(tasks).where(eq(tasks.assigneeId, assigneeId))
    return task
}

async function updateTask(id, fields) {
    const [task] = await db.update(tasks).set(fields).where(eq(tasks.id, id)).returning()
    return task
}

async function deleteTask(id) {
    const [task] = await db.delete(tasks).where(eq(tasks.id, id)).returning()
    return task
}

module.exports = { createTask, findTaskById, findTasksByProject, findTasksByAssignee, updateTask, deleteTask }