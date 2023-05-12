const { getAllOrders, getSingleOrder, updateOrderStatus, createOrder, getAllUserOrders } = require('../controllers/orderController')
const { authorizeUser, authenticateUser } = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.route('/').get(authenticateUser, getAllUserOrders).post(authenticateUser, createOrder)
router.route('/all-orders').get(authenticateUser, authorizeUser('admin'), getAllOrders)
router.route('/:id').get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrderStatus)

module.exports = router