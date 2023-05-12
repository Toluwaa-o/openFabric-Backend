const CustomError = require('../errors')
const { isTokenValid } = require('../utils/jwt')

const authenticateUser = async (req, res, next) => {
    let token;

    if(req.signedCookies.token) token = req.signedCookies.token

    if(!token) throw new CustomError.Unauthenticated(`Authentication Invalid`)

    try {
        const payload = isTokenValid(token)

        req.user = {
            userId: payload.userId,
            role: payload.role
        }

        next()
    } catch (error) {
        throw new CustomError.Unauthenticated(`Authentication Invalid`)
    }
}

const authorizeUser = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) throw new CustomError.Unauthorized('User unauthorized to access this route')

        next()
    }
}

module.exports = { authorizeUser, authenticateUser }