const express = require('express')
const authcontroller = require('../controllers/authController')

const router = express.Router()

router.post("/login", authcontroller.login)
router.post("/register", authcontroller.register)

module.exports = router