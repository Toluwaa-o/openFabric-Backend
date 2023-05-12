const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    price: {
        type: Number,
        required: String
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        minLength: 20
    },
    image: {
        type: String,
        required: [true, 'Please provide an image']
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    inventory: {
        type: Number,
        default: 15,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    numOfRatings: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
        enum: ['fashion', 'electronics', 'computers/phones', 'kitchen', 'beauty', "other"],
        default: 'other'
    },
    freeShipping: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        default: 0
    }

}, {timestamps: true, toJSON: {virtuals: true}, toObject: {virtuals: true}})

ProductSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'product',
    justOne: false
})

ProductSchema.pre('deleteOne', {document: true}, async function(next){
    await this.model('Review').deleteMany({product: this._id})
})

module.exports = mongoose.model('Product', ProductSchema)