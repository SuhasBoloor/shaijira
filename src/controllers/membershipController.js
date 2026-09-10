const membershipService = require('../service/membershipService');

async function createMembership(req, res) {
    try {
        const { userId, roleId } = req.body;
        const organizationId = req.headers['organization-id'] || req.body.organizationId;

        if (!userId) throw new Error("User ID is required");
        if (!roleId) throw new Error("Role ID is required");
        if (!organizationId) throw new Error("Organization ID is required");

        const membership = await membershipService.createMembership(userId, organizationId, roleId);
        return res.status(201).json({ message: "Member added successfully", data: membership });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function deleteMembership(req, res) {
    try {
        const { userId, roleId } = req.body;
        const organizationId = req.headers['organization-id'] || req.body.organizationId;

        if (!userId) throw new Error("User ID is required");
        if (!roleId) throw new Error("Role ID is required");
        if (!organizationId) throw new Error("Organization ID is required");

        const removed = await membershipService.deleteMembership(userId, organizationId, roleId);
        return res.status(200).json({ message: "Member removed successfully", data: removed });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { createMembership, deleteMembership };