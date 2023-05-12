const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Please provide a review']
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating']
    },
    title: {
        type: String,
        required: [true, 'Please provide a title']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
}, {timestamps: true})

ReviewSchema.index({product: 1, user: 1}, {unique: true})

ReviewSchema.statics.calculateAverageRating = async function (prodId) {
    const result = await this.aggregate([
        {$match: {
            product: prodId
        }},
        {$group: {
            _id: prodId,
            averageRating: {$avg: '$rating'},
            numOfRatings: {$sum: 1}
        }}
    ])

    try{
        await this.model('Product').findOneAndUpdate({_id: prodId}, {
            averageRating: Math.ceil(result[0]?.averageRating || 0), 
            numOfRatings: result[0]?.numOfRatings || 0
        })
    }catch(error){
        console.log(error)
    }
}

ReviewSchema.post('save', async function() {
    await this.constructor.calculateAverageRating(this.product)
})

ReviewSchema.post('deleteOne', {document: true}, async function() {
    await this.constructor.calculateAverageRating(this.product)
})

module.exports = mongoose.model('Review', ReviewSchema)