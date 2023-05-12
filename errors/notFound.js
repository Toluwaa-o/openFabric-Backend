const CustomAPIError = require('./customAPIErrors')

class NotFound extends CustomAPIError {
    constructor(message) {
        super(message)
        this.statusCode = 404
    }
}

module.exports = NotFound