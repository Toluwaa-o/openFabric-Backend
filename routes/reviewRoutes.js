const { createReview, editReview, deleteReview, getSingleReview } = require('../controllers/reviewController')
const { authenticateUser } = require('../middleware/auth')
const express = require('express')
const router = express.Router()

router.route('/').post(authenticateUser, createReview)
router.route('/:id').get(authenticateUser, getSingleReview).patch(authenticateUser, editReview).delete(authenticateUser, deleteReview)

module.exports = router