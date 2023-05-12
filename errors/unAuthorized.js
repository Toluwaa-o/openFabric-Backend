const CustomAPIErrors = require('./customAPIErrors')

class Unauthorized extends CustomAPIErrors {
    constructor(message) {
        super(message)
        this.statusCode = 403
    }
}

module.exports = Unauthorized