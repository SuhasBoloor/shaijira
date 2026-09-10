const roleRepository = require('../repository/roleRepository');
const rolePermissionRepository = require('../repository/rolePermissionRepository');
const permissionRepository = require('../repository/permissionRepository');

async function getRoles(req, res) {
    try {
        const organizationId = req.headers['organization-id'] || req.query.organizationId;
        if (!organizationId) throw new Error("Organization ID is required");

        const rolesList = await roleRepository.findRolesByOrg(organizationId);

        const enrichedRoles = await Promise.all(
            rolesList.map(async (role) => {
                const permissions = await rolePermissionRepository.findPermissionNamesByRole(role.id);
                return {
                    ...role,
                    permissions
                };
            })
        );

        return res.status(200).json({ message: "Roles retrieved successfully", data: enrichedRoles });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function createRole(req, res) {
    try {
        const { name, permissions } = req.body;
        const organizationId = req.headers['organization-id'] || req.body.organizationId;

        if (!name || !name.trim()) throw new Error("Role name is required");
        if (!organizationId) throw new Error("Organization ID is required");

        const trimmedName = name.trim();
        const existing = await roleRepository.findRoleByNameAndOrg(trimmedName, organizationId);
        if (existing) {
            return res.status(400).json({ error: `Role "${trimmedName}" already exists in this organization` });
        }

        const role = await roleRepository.createRole(trimmedName, organizationId);

        const assignedPermissions = [];
        if (Array.isArray(permissions)) {
            for (const item of permissions) {
                let permRecord;
                if (typeof item === 'number') {
                    permRecord = await permissionRepository.findPermissionById(item);
                } else if (typeof item === 'string') {
                    permRecord = await permissionRepository.findPermissionByName(item);
                }

                if (permRecord) {
                    await rolePermissionRepository.assignPermissionToRole(role.id, permRecord.id);
                    assignedPermissions.push(permRecord.name);
                }
            }
        }

        return res.status(201).json({
            message: "Role created successfully",
            data: {
                ...role,
                permissions: assignedPermissions
            }
        });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

async function getAllPermissions(req, res) {
    try {
        const allPermissions = await permissionRepository.findAllPermissions();
        return res.status(200).json({ message: "Permissions retrieved successfully", data: allPermissions });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getRoles, createRole, getAllPermissions };
