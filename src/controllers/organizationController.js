const organizationServices = require('../service/organiationService')
const organizationRepository = require('../repository/organizationRepository')

async function createOrganization(req, res){
    try {
        const {userId} = req.user
        const {name} = req.body
        if(!name) throw new Error("Name is required")
        const org = await organizationServices.createOrganization(name, userId)
        res.status(201).json({
            message:"Organisation created successfully",
            data: org
        })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
}

async function getUserOrganizations(req, res) {
    try {
        const { userId, isSuperAdmin } = req.user;
        let orgs;
        if (isSuperAdmin) {
            orgs = await organizationRepository.getAllOrganizations();
        } else {
            orgs = await organizationRepository.getOrganizationsByUser(userId);
        }
        res.status(200).json({
            message: "Organizations retrieved",
            data: orgs
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = { createOrganization, getUserOrganizations }