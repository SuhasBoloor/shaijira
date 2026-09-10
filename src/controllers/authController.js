const authService = require('../service/authService')

async function register(req, res) {
    try {
        const {username, password} = req.body

        if(!username) throw new Error("User name is required")
        if(!password) throw new Error("password is required")
        const result = await authService.register(username, password)
        res.status(200).json({
            message:"Registration succesfull",
            data: {id: result.id, username:result.username}
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
}

async function login(req, res){
    try {
        const {username, password} = req.body

        if(!username) throw new Error("User name is required")
        if(!password) throw new Error("password is required")
        const result = await authService.login(username, password)
        res.status(200).json({
            message:"Login successful",
            data: {
                id:result.id,
                username:username,
                token: result.token
            }
        })
    } catch (error) {
        return res.status(400).json({ error: error.message })
        
    }

}

module.exports = {register, login}