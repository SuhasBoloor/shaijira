const {client: redis} = require('../config/redis')
const memebershipRepository = require('../repository/memebershipRepository')
const role_permissions = require('../repository/rolePermissionRepository')

function requirePermission(permission){
    return async function (req, res, next){

        if (req.user.isSuperAdmin) {
            return next(); // 🚀 SuperAdmin bypasses all org and permission checks!
        }
        const userId = req.user.userId
        const organizationId = req.headers['organization-id'] || req.headers.organizationid || req.params.organizationId || req.body?.organizationId;
        if(!organizationId){
            res.status(400).json("Organisation id is required")
            return
        }

        const  cacheKey = `permissions:${userId}:${organizationId}`

        try {
            let permissions

            const cached = await redis.get(cacheKey)

            if(cached){
                permissions = JSON.parse(cached)
            } else {
                const memebership = await memebershipRepository.findByUserAndOrg(userId, organizationId)

                if(!memebership){
                    res.status(403).json("not a memeber of this organisation")
                    return
                }

                permissions = await role_permissions.findPermissionNamesByRole(memebership.roleId)

                await redis.set(cacheKey, JSON.stringify(permissions), {EX:600})
            }

            if (!permissions.includes(permission)) {
                return res.status(403).json("Forbidden: insufficient permissions");
            }
            next()
        } catch (error) {
            console.error("RBAC middleware error:", error);
            return res.status(500).json("Internal server error");
        }
    }

}

module.exports = {requirePermission}