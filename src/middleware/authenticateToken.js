const config = require('../config/env')
const jwt = require("jsonwebtoken")

async function  authenticateToken(req, res, next){
    const token = req.headers.authorization

    if(!token) {
        res.status(401).json("Invalid or expired token")
        return
    }

    const auth = token.split(" ")[1]

    try {
        const decode = jwt.verify(auth, config.JWT_SECRET)
        req.user =  decode
        next()
    } catch (error) {
        res.status(401).json("Invalid or expired token")
        return
    }
    
}

module.exports = {authenticateToken}