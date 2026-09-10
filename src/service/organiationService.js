const organizationRepository = require('../repository/organizationRepository')
const roleRepository = require('../repository/roleRepository')
const rolePermissionRepository = require('../repository/rolePermissionRepository')
const membershipRepository = require('../repository/memebershipRepository')
const permissionRepository = require('../repository/permissionRepository')

async function createOrganization(name, userId){
    const org = await organizationRepository.createOrganization(name)
    const role = await roleRepository.createRole("admin", org.id)
    const permission = await permissionRepository.findAllPermissions()
    for (const item of permission) {
        await rolePermissionRepository.assignPermissionToRole(role.id, item.id)
    }
    const membership = await membershipRepository.createMembership(userId, org.id, role.id)
    return org
}

module.exports = {createOrganization}