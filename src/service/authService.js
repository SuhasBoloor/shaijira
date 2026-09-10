const userRepository = require('../repository/userRepository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../config/env')

async function register(username, password){
    const user = await userRepository.getUser(username)

    if(user) throw new Error("Username already exists")
    
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = await userRepository.createUser(username, hashedPassword)


    return {
        id:newUser.id,
        username: newUser.username
    }
}

async function login(username, password){
    const user = await userRepository.getUser(username)
    if(!user) throw new Error("Invalid Credentials")

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error("Invalid Credentials")

    const token = jwt.sign(
        { userId: user.id, isSuperAdmin: user.isSuperAdmin }, 
        config.JWT_SECRET, 
        { expiresIn: "1h" }
    );

    return {
        id: user.id,
        username:user.username,
        token
    }
}

module.exports = { register, login}