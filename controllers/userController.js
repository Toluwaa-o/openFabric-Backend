const User = require('../models/User') // import user model
const CustomErrors = require('../errors') // import custom errors as an object
const checkPermissions = require('../utils/checkPermission')


const updateUser = async (req, res) => {
    const user = await User.findOneAndUpdate({_id: req.user.userId}, req.body, {new: true, runValidators: true})


    res.status(200).json({ msg: 'User successfully updated' })
}

const showCurrentUser = async (req, res) => {
    if(!req.user) throw new CustomErrors.Unauthenticated(`User is not authorized to access this route`)

    res.status(200).json({ user: req.user})
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body

    if(!oldPassword || !newPassword) throw new CustomErrors.BadRequest('Please provide the old and new password')

    const user = await User.findOne({_id: req.user.userId})
    const isCorrectPassword = await user.comparePassword(oldPassword)

    if(!isCorrectPassword) throw new CustomErrors.Unauthenticated(`Incorrect password`)

    user.password = newPassword
    await user.save()

    const userData = {name: user.name, email: user.email, _id: user._id, role: user.role}

    res.status(200).json({ user: userData })
}

const getAllUsers = async (req, res) => {
    const users = await User.find({role: 'user'}).select('-password')

    if(users.length < 1) throw new CustomErrors.NotFound(`No users found`)

    res.status(200).json({ users })
}

const getSingleUser = async (req, res) => {
    const { id } = req.params

    const user = await User.findOne({_id: id}).select('-password')
    if(!user) throw new CustomErrors.NotFound(`No user found with id ${id}`)

    checkPermissions(req.user, id)

    res.status(200).json({ user })
}

const deleteUser = async (req, res) => {
    const user = await User.findOneAndDelete({_id: req.user.userId})

    res.status(200).json({ msg: 'User deleted' })
}

module.exports = { updateUser, changePassword, showCurrentUser, getSingleUser, getAllUsers, deleteUser }