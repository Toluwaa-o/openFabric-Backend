const { getAllProducts, getSingleProduct, addProduct, deleteProduct, updateProduct, uploadImage } = require('../controllers/productController')
const { authorizeUser, authenticateUser } = require('../middleware/auth')
const { getProductReviews } = require('../controllers/reviewController')
const express = require('express')
const router = express.Router()

router.route('/').get(getAllProducts).post(authenticateUser, authorizeUser('admin'), addProduct)
router.route('/upload-image').post(authenticateUser, authorizeUser('admin'), uploadImage)
router.route('/:id').get(getSingleProduct).patch(authenticateUser, authorizeUser('admin'), updateProduct).delete(authenticateUser, authorizeUser('admin'), deleteProduct)
router.route('/:id/reviews').get(getProductReviews)

module.exports = router