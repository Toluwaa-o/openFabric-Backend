const Order = require('../models/Order')
const CustomErrors = require('../errors')
const Product = require('../models/Product')
const checkPermissions = require('../utils/checkPermission')

const createOrder = async (req, res) => {
    const { tax, shippingFee, items: cartItems } = req.body

    if(!cartItems || cartItems.length < 1) throw new CustomErrors.BadRequest('Cart cannot be empty')

    let subTotal = 0
    let orderItems = []

    for(let item of cartItems) {
        const dbProduct = await Product.findOne({_id: item.product})

        if(!dbProduct) throw new CustomErrors.NotFound(`No product found with id ${item.product}`)

        const { title, price, image, _id } = dbProduct

        const singleOrderItem = {
            amount: item.amount, title, price, image, product: _id
        }

        orderItems = [...orderItems, singleOrderItem]
        subTotal += (price * item.amount)  
      }

    const total = subTotal + tax + shippingFee
    const order = await Order.create({tax, shippingFee, subTotal, total, orderItems, user: req.user.userId})

    res.status(201).json({ order })
}

const getAllUserOrders = async (req, res) => {
    const order = await Order.find({user: req.user.userId})

    if(!order || order.length < 1) throw new CustomErrors.NotFound('No orders found')

    res.status(200).json({ order })
}

const getAllOrders = async (req, res) => {
    const order = await Order.find({})

    if(!order || order.length < 1) throw new CustomErrors.NotFound('No orders found')

    res.status(200).json({ order })
}

const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    const order = await Order.findOneAndUpdate({_id: req.params.id}, {status}, {new: true, runValidators: true})

    checkPermissions(req.user, order.user)
    
    res.status(200).json({ order })
}

const getSingleOrder = async (req, res) => {
    const order = await Order.findOne({_id: req.params.id})

    if(!order) throw new CustomErrors.NotFound('No orders found')

    checkPermissions(req.user, order.user)

    res.status(200).json({ order })
}

module.exports = { getAllOrders, getSingleOrder, updateOrderStatus, createOrder, getAllUserOrders }
