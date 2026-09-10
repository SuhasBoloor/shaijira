const membershipService = require('../service/membershipService');

async function createMembership(req, res) {
    try {
        const { userId, username, roleId, roleName } = req.body;
        const organizationId = req.headers['organization-id'] || req.body.organizationId;

        if (!userId && !username) throw new Error("User ID or Username is required");
        if (!roleId && !roleName) throw new Error("Role ID or Role Name is required");
        if (!organizationId) throw new Error("Organization ID is required");

        const membership = await membershipService.createMembership({
            userId,
            username,
            organizationId,
            roleId,
            roleName
        });
        return res.status(201).json({ message: "Member added successfully", data: membership });
    } catch (error) {
        const statusCode = error.message.includes("not found") ? 404 : 400;
        return res.status(statusCode).json({ error: error.message });
    }
}

async function getMemberships(req, res) {
    try {
        const organizationId = req.headers['organization-id'] || req.query.organizationId;
        if (!organizationId) throw new Error("Organization ID is required in headers ('organization-id')");

        const members = await membershipService.getMembershipsByOrg(organizationId);
        return res.status(200).json({ message: "Members retrieved successfully", data: members });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deleteMembership(req, res) {
    try {
        const { userId, username, roleId, roleName } = req.body;
        const organizationId = req.headers['organization-id'] || req.body.organizationId;

        if (!userId && !username) throw new Error("User ID or Username is required");
        if (!organizationId) throw new Error("Organization ID is required");

        const removed = await membershipService.deleteMembership({
            userId,
            username,
            organizationId,
            roleId,
            roleName
        });
        return res.status(200).json({ message: "Member removed successfully", data: removed });
    } catch (error) {
        const statusCode = error.message.includes("not found") ? 404 : 400;
        return res.status(statusCode).json({ error: error.message });
    }
}

module.exports = { createMembership, getMemberships, deleteMembership };