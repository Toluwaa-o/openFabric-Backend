const Review = require('../models/Review')
const CustomErrors = require('../errors')
const checkPermissions = require('../utils/checkPermission')

const createReview = async (req, res) => {
    const { comment, rating, product, title } = req.body

    if(!comment || !rating || !product || !title) throw new CustomErrors.BadRequest('Please fill all the neccessary fields')

    const oldReview = await Review.findOne({user: req.user.userId, product})

    if(oldReview) throw new CustomErrors.Unauthorized(`User already created a review for that product`)

    req.body.user = req.user.userId

    const review = await Review.create(req.body)

    res.status(201).json({ review })
}

const editReview = async (req, res) => {
    const { comment, title, rating } = req.body
    const { id: revId } = req.params

    const review = await Review.findOne({ _id: revId })

    if(!review) throw new CustomErrors.NotFound('No review found')

    checkPermissions(req.user, review.user)

    review.comment = comment
    review.title = title
    review.rating = rating

    await review.save()

    res.status(200).json({ review })
}

const deleteReview = async (req, res) => {
    const { id: reviewId } = req.params

    const review = await Review.findOne({_id: reviewId})
    if(!review) throw new CustomErrors.NotFound(`No review found with id ${reviewId}`)

    checkPermissions(req.user, review.user)

    await review.deleteOne()
    res.status(200).json({ msg: 'Review deleted' })
}

const getSingleReview = async (req, res) => {
    const {id} = req.params

    const review = await Review.findOne({_id: id}).populate({path: 'product', select: 'name category price'})
    if(!review) throw new CustomErrors.NotFound(`No review found with id ${id}`)

    res.status(200).json({ review })
}

const getProductReviews = async (req, res) => {
    const { id: productId } = req.params

    const reviews = await Review.find({product: productId}).populate({path: 'user', select: 'name'})
    if(reviews.length < 1 || !reviews) throw new CustomErrors.NotFound('No reviews found')

    res.status(200).json({ reviews })
}

module.exports = { createReview, editReview, deleteReview, getProductReviews, getSingleReview }
