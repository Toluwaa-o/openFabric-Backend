const User = require('../models/User') // import user model
const CustomErrors = require('../errors') // import custom errors as an object
const {attachCookies} = require('../utils/jwt')

const register = async (req, res) => {
    const { name, email, password } = req.body // deconstructing the req body

    if(!name || !email || !password) throw new CustomErrors.BadRequest('Please provide a value for all necessary fields')

    const isFirstSecond = await User.countDocuments({}) <= 1
    const role = isFirstSecond ? 'admin' : 'user'

    const user = await User.create({ name, email, password, role })
    const userData = {name: user.name, email: user.email, _id: user._id, role: user.role}
    const tokenUser = { userId: user._id, role: user.role }
    await attachCookies({res, user: tokenUser})

    res.status(201).json({ user: userData })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if(!email || !password) throw CustomErrors.BadRequest('Please provide an email and a password')

    const user = await User.findOne({email})

    if(!user) throw new CustomErrors.NotFound(`No user found with those credentials`)

    const passwordMatch = await user.comparePassword(password)

    if(!passwordMatch) throw new CustomErrors.Unauthenticated(`Incorrect login credentials`)

    const userData = {name: user.name, email: user.email, _id: user._id, role: user.role}
    const tokenUser = { userId: user._id, role: user.role }

    await attachCookies({res, user: tokenUser})

    res.status(200).json({ user: userData })
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({ msg: 'user logged out' })
}

module.exports = { register, login, logout }