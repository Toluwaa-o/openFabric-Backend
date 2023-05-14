const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../controllers/authControllers')

//routes
router.route('/login').post(login)
router.route('/signup').post(register)
router.route('/logout').delete(logout)

module.exports = router