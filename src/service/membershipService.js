const memebershipRepository = require('../repository/memebershipRepository')

async function createMembership(userId, organizationId, roleId){
    const membership = await memebershipRepository.findByUserAndOrg(userId, organizationId)
    if(membership) throw new Error("Membership already existis in this organisation")

    const newMembership = await memebershipRepository.createMembership(userId, organizationId, roleId)
    return newMembership
}

async function deleteMembership(userId, organizationId, roleId){
    const membership = await memebershipRepository.findByUserAndOrg(userId, organizationId)
    if(!membership) throw new Error("This memebership does not exist")

    const remove = await memebershipRepository.deleteMembership(userId, organizationId, roleId)
    return remove
}

module.exports = {createMembership, deleteMembership}