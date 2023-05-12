const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minLength: 5
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        validate: {
            validator: validator.isEmail,
            message: 'Please provide a valid email'
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 8
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
})

UserSchema.pre('save', async function(){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
})

UserSchema.methods.comparePassword = async function(pword){
    const isMatch = await bcrypt.compare(pword, this.password)

    return isMatch
}

module.exports = mongoose.model('User', UserSchema)