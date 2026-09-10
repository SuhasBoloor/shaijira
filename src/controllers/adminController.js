const { db } = require('../config/db');
const { users, organizations, projects, tasks, permissions, roles, memberships } = require('../models/schema');
const { count, eq } = require('drizzle-orm');
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

async function getOverview(req, res) {
    try {
        if (!req.user?.isSuperAdmin) {
            return res.status(403).json({ error: "Access denied: SuperAdmin required" });
        }

        const allOrgs = await db.select().from(organizations);

        const overview = await Promise.all(
            allOrgs.map(async (org) => {
                // Get members of this organization
                const orgMembers = await db.select({
                    userId: users.id,
                    username: users.username,
                    roleId: roles.id,
                    roleName: roles.name
                })
                .from(memberships)
                .innerJoin(users, eq(users.id, memberships.userId))
                .innerJoin(roles, eq(roles.id, memberships.roleId))
                .where(eq(memberships.organizationId, org.id));

                // Get projects of this organization
                const orgProjects = await db.select().from(projects).where(eq(projects.organizationId, org.id));

                // For each project, fetch all tasks and calculate counts
                let orgTodoCount = 0;
                let orgInProgressCount = 0;
                let orgDoneCount = 0;
                let orgTotalTasks = 0;

                const enrichedProjects = await Promise.all(
                    orgProjects.map(async (proj) => {
                        const projTasks = await db.select({
                            id: tasks.id,
                            title: tasks.title,
                            description: tasks.description,
                            status: tasks.status,
                            createdAt: tasks.createdAt,
                            assigneeId: tasks.assigneeId,
                            assigneeUsername: users.username
                        })
                        .from(tasks)
                        .leftJoin(users, eq(users.id, tasks.assigneeId))
                        .where(eq(tasks.projectId, proj.id));

                        const todo = projTasks.filter(t => t.status === 'todo').length;
                        const in_progress = projTasks.filter(t => t.status === 'in_progress').length;
                        const done = projTasks.filter(t => t.status === 'done').length;

                        orgTodoCount += todo;
                        orgInProgressCount += in_progress;
                        orgDoneCount += done;
                        orgTotalTasks += projTasks.length;

                        return {
                            ...proj,
                            taskCounts: {
                                total: projTasks.length,
                                todo,
                                in_progress,
                                done
                            },
                            tasks: projTasks
                        };
                    })
                );

                return {
                    ...org,
                    members: orgMembers,
                    projects: enrichedProjects,
                    summary: {
                        totalMembers: orgMembers.length,
                        totalProjects: orgProjects.length,
                        totalTasks: orgTotalTasks,
                        todo: orgTodoCount,
                        in_progress: orgInProgressCount,
                        done: orgDoneCount
                    }
                };
            })
        );

        return res.status(200).json({
            message: "Platform overview retrieved successfully",
            data: overview
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

module.exports = { getStats, getOverview, seedData };
