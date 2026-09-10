const { db } = require('../config/db');
const { users, organizations, projects, tasks, permissions, roles } = require('../models/schema');
const { count } = require('drizzle-orm');
const permissionRepository = require('../repository/permissionRepository');

async function getStats(req, res) {
    try {
        if (!req.user?.isSuperAdmin) {
            return res.status(403).json({ error: "Access denied: SuperAdmin required" });
        }

        const [userCount] = await db.select({ count: count() }).from(users);
        const [orgCount] = await db.select({ count: count() }).from(organizations);
        const [projCount] = await db.select({ count: count() }).from(projects);
        const [taskCount] = await db.select({ count: count() }).from(tasks);
        const allPermissions = await permissionRepository.findAllPermissions();
        const allOrgs = await db.select().from(organizations);
        const allUsers = await db.select({
            id: users.id,
            username: users.username,
            isSuperAdmin: users.isSuperAdmin,
            createdAt: users.createdAt
        }).from(users);

        return res.status(200).json({
            stats: {
                users: userCount.count,
                organizations: orgCount.count,
                projects: projCount.count,
                tasks: taskCount.count,
                permissions: allPermissions.length
            },
            organizations: allOrgs,
            users: allUsers,
            permissions: allPermissions
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function seedData(req, res) {
    try {
        if (!req.user?.isSuperAdmin) {
            return res.status(403).json({ error: "Access denied: SuperAdmin required" });
        }

        const defaultPermissions = [
            { name: "project:create", description: "create new projects" },
            { name: "project:update", description: "update existing projects" },
            { name: "project:delete", description: "delete existing projects" },
            { name: "task:create", description: "create new tasks" },
            { name: "task:update", description: "update existing tasks" },
            { name: "task:delete", description: "delete existing tasks" },
            { name: "task:assign", description: "assign tasks to users" },
            { name: "member:add", description: "add members to organisation" },
            { name: "member:remove", description: "remove members from organisation" }
        ];

        let createdCount = 0;
        for (const p of defaultPermissions) {
            const existing = await permissionRepository.findPermissionByName(p.name);
            if (!existing) {
                await permissionRepository.createPermission(p.name, p.description);
                createdCount++;
            }
        }

        return res.status(200).json({
            message: `Seed completed successfully. ${createdCount} new permissions created.`,
            totalPermissions: (await permissionRepository.findAllPermissions()).length
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getStats, seedData };
