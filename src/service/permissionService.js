const permissionRepository = require('../repository/permissionRepository')

async function createPermission(name, description){
    const permission = await permissionRepository.findPermissionByName(name)
    if(permission) throw new Error("Permssion already exists")

    const newPermission = await permissionRepository.createPermission(name, description)
    return newPermission
}

async function updatePermssion(id, name){
    const permission = await permissionRepository.findPermissionById(id)
    if(!permission) throw new Error("Permission does not exists")

    const permissionName = await permissionRepository.findPermissionByName(name)
    if(permissionName  && permissionName.id !== id) throw new Error("Permssion name already exists")

    const update = await permissionRepository.updatePermission(id, name)
    return update
}

async function deletePermission(id){
    const permission = await permissionRepository.findPermissionById(id)
    if(!permission) throw new Error("Permission does not exists")

    const remove = await permissionRepository.deletePermission(id)
    return remove
}

module.exports = {createPermission, updatePermssion, deletePermission}