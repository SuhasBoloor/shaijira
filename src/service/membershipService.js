const memebershipRepository = require('../repository/memebershipRepository');
const userRepository = require('../repository/userRepository');
const roleRepository = require('../repository/roleRepository');
const { client: redis } = require('../config/redis');

async function createMembership({ userId, username, organizationId, roleId, roleName }) {
    if (!userId && username) {
        const user = await userRepository.getUser(username);
        if (!user) {
            throw new Error(`User "${username}" not found`);
        }
        userId = user.id;
    }

    if (!roleId && roleName) {
        const role = await roleRepository.findRoleByNameAndOrg(roleName, organizationId);
        if (!role) {
            throw new Error(`Role "${roleName}" not found in this organization`);
        }
        roleId = role.id;
    }

    if (!userId) throw new Error("User ID or Username is required");
    if (!roleId) throw new Error("Role ID or Role Name is required");
    if (!organizationId) throw new Error("Organization ID is required");

    const existing = await memebershipRepository.findByUserAndOrg(userId, organizationId);
    if (existing) {
        throw new Error("User is already a member of this organization");
    }

    const newMembership = await memebershipRepository.createMembership(userId, organizationId, Number(roleId));

    try {
        await redis.del(`permissions:${userId}:${organizationId}`);
    } catch (_) {}

    return newMembership;
}

async function getMembershipsByOrg(organizationId) {
    if (!organizationId) throw new Error("Organization ID is required");
    return await memebershipRepository.getMembersByOrg(organizationId);
}

async function deleteMembership({ userId, username, organizationId, roleId, roleName }) {
    if (!userId && username) {
        const user = await userRepository.getUser(username);
        if (!user) {
            throw new Error(`User "${username}" not found`);
        }
        userId = user.id;
    }

    if (!roleId && roleName) {
        const role = await roleRepository.findRoleByNameAndOrg(roleName, organizationId);
        if (role) {
            roleId = role.id;
        }
    }

    if (!userId) throw new Error("User ID or Username is required");
    if (!organizationId) throw new Error("Organization ID is required");

    const membership = await memebershipRepository.findByUserAndOrg(userId, organizationId);
    if (!membership) throw new Error("This membership does not exist");

    const removed = await memebershipRepository.deleteMembership(userId, organizationId, roleId ? Number(roleId) : null);

    try {
        await redis.del(`permissions:${userId}:${organizationId}`);
    } catch (_) {}

    return removed;
}

module.exports = { createMembership, getMembershipsByOrg, deleteMembership };