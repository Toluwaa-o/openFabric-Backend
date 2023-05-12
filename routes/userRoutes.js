const { updateUser, changePassword, showCurrentUser, getSingleUser, getAllUsers, deleteUser } = require('../controllers/userController')
const { authorizeUser, authenticateUser } = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.route('/').get(authenticateUser, authorizeUser('admin'), getAllUsers).patch(authenticateUser, updateUser).delete(authenticateUser, deleteUser)
router.route('/change-password').patch(authenticateUser, changePassword)
router.route('/show-user').get(authenticateUser, showCurrentUser)
router.route('/:id').get(authenticateUser, getSingleUser)

module.exports = router