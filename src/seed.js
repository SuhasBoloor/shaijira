const permissionRepository = require('./repository/permissionRepository')
const userRepository = require('./repository/userRepository')
const bcrypt = require('bcrypt')
const { db } = require('./config/db')
const { users } = require('./models/schema')
const { eq } = require('drizzle-orm')

async function seed() {
    try {
        const permissions = [
            "project:create", "project:update", "project:delete",
            "task:create", "task:update", "task:delete", "task:assign",
            "member:add", "member:remove"
        ];

        for (const p of permissions) {
            try {
                await permissionRepository.createPermission(p);
            } catch (_) {}
        }
        console.log("Permissions seeded successfully");

        // Seed default SuperAdmin user
        const adminUsername = "admin";
        const adminPassword = "AdminPassword123!";

        const existingAdmin = await userRepository.getUser(adminUsername);
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await db.insert(users).values({
                username: adminUsername,
                password: hashedPassword,
                isSuperAdmin: true
            });
            console.log(`Default SuperAdmin created -> Username: ${adminUsername} | Password: ${adminPassword}`);
        } else if (!existingAdmin.isSuperAdmin) {
            await db.update(users).set({ isSuperAdmin: true }).where(eq(users.username, adminUsername));
            console.log(`Promoted user '${adminUsername}' to SuperAdmin`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed().catch(err => {
    console.error(err);
    process.exit(1);
});