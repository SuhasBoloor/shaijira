const {users} = require('../models/schema')
const {db} = require('../config/db')
const {eq} = require('drizzle-orm')

async function createUser(username, password){
    const [user] = await db.insert(users).values({username, password}).returning()
    return user
}

async function getUser(username){
    const [user] = await db.select().from(users).where(eq( users.username, username))
    return user
}

async function updateUser(id, username, password){
    const [user] = await db.update(users).set({username, password}).where(eq(users.id, id)).returning()
    return user
}

async function deleteUser(id){
    const [user] = await db.delete(users).where(eq(users.id, id)).returning()
    return user
}

module.exports = {createUser, getUser, updateUser, deleteUser}