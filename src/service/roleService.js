const roleRepository = require('../repository/roleRepository')

async function createRole(name, organisationId){
    const role = await roleRepository.findRoleByNameAndOrg(name, organisationId)
    if(role) throw new Error("Role already exists in the organization")
    
    const newRole = await roleRepository.createRole(name, organisationId)
    return newRole
}

async function updateRole(id, name){
    const role = await roleRepository.findRoleById(id)
    if(!role) throw new Error("Role does not exists in the organization")

    const roleName = await roleRepository.findRoleByNameAndOrg(name, role.organizationId)
    if(roleName && roleName.id !== id) throw new Error("Role name already exists in the organization")
    
    const update = await roleRepository.updateRole(id, name)
    return update

}

async function deleteRole(id){
    const role = await roleRepository.findRoleById(id)
    if(!role) throw new Error("Role cannot bedelete as it does not exists")

    const remove = await roleRepository.deleteRole(id)
    return remove


}

module.exports = {createRole, updateRole, deleteRole}