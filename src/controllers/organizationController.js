const organizationServices = require('../service/organiationService')

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


module.exports = {createOrganization}