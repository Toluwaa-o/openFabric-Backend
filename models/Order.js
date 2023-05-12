const mongoose = require('mongoose')

const SingleOrderItemSchema = new mongoose.Schema({
    title: {type: String, required: true },
    image: {type: String, required: true },
    price: {type: String, required: true },
    amount: {type: String, required: true },
    product: {type: mongoose.Schema.ObjectId, required: true, ref: 'Product' }
})

const OrderSchema = new mongoose.Schema({
    tax: {
        type: Number,
        required: true
    },
    shippingFee: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'failed', 'cancelled', 'delivered', 'paid'],
        default: 'pending'
    },
    orderItems: [SingleOrderItemSchema]

}, { timestamps: true })

module.exports = mongoose.model('Order', OrderSchema)