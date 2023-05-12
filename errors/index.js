const BadRequest = require('./badRequest')
const Unauthenticated = require('./unAuthenticated')
const Unauthorized = require('./unAuthorized')
const NotFound = require('./notFound')
const CustomAPIError = require('./customAPIErrors')

module.exports = { BadRequest, Unauthenticated, Unauthorized, NotFound, CustomAPIError }