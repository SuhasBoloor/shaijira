const permissionRepository = require('./repository/permissionRepository')

async function seed() {
    try {
        
        await permissionRepository.createPermission("project:create")
        await permissionRepository.createPermission("project:update")
        await permissionRepository.createPermission("project:delete")
        await permissionRepository.createPermission("task:create")
        await permissionRepository.createPermission("task:update")
        await permissionRepository.createPermission("task:delete")
        await permissionRepository.createPermission("task:assign")
        await permissionRepository.createPermission("member:add")
        await permissionRepository.createPermission("member:remove")
        console.log("Seeded successfully")
        process.exit(0)
    } catch (error) {
        console.error("Seed failed:", error)
        process.exit(1)
    }
}

seed().catch(err => {
    console.error(err)
    process.exit(1)
})