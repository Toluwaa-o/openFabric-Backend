const Product = require('../models/Product')
const CustomErrors = require('../errors')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

const getAllProducts = async (req, res) => {
    const { title, numFilter, sort, category } = req.query

    const queryObject = {}

    if(title) {
        queryObject.title = {$regex: title, $options: 'i'}
    }

    if(numFilter) {
        const operatorMap = {
            '>':'$gt',
            '<':'$lt',
            '>=':'$gte',
            '=':'$eq',
            '<=':'$lte',
        }

        const regEx = /[\<|>]/g
        let filters = numFilter.replace(regEx, (match) => `-${operatorMap[match]}-`)

        const options = 'price'

        filters = filters.split(',').forEach(i => {
            const [field, operator, value] = i.split('-')
            if(options === field) {
                queryObject[field] = {...queryObject[field], [operator]: Number(value)}
            }
        })
    }


    if(category && category !== 'all') {
        queryObject.category = category
    }

    let prod = Product.find(queryObject).populate('reviews')

    if(sort) {
        const sortList = sort.split(',').join(' ')
        prod = prod.sort(sortList)
    }else {
        prod = prod.sort('createdAt')
    }

    let limit = req.query.limit || 10
    let page = req.query.page || 1
    let skip = (page - 1) * limit

    prod = prod.limit(limit).skip(skip)

    const products = await prod
    const totalProds = await Product.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalProds/limit)

    if(products.length < 1 || !products) throw new CustomErrors.NotFound('No products available')

    res.status(200).json({ products, numOfPages })
}

const getSingleProduct = async (req, res) => {
    const {id} = req.params

    const product = await Product.findOne({_id: id})
    if(!product) throw new CustomErrors.NotFound(`No product found with id ${id}`)

    res.status(200).json({ product })
}

const addProduct = async (req, res) => {
    const { title, price, description, image, inventory, category } = req.body

    if(!title || !price || !description || !image || !inventory || !category) throw new CustomErrors.BadRequest('Please fill all required fields')

    req.body.createdBy = req.user.userId

    const product = await Product.create(req.body)

    res.status(201).json({ product })
}

const deleteProduct = async (req, res) => {
    const { id } = req.params

    const product = await Product.findOne({_id: id})

    if(!product) throw new CustomErrors.NotFound(`No product found with id ${id}`)

    await product.deleteOne()

    res.status(200).json({ msg: 'Product deleted'})
}

const updateProduct = async (req, res) => {
    const { id } = req.params

    const prod = await Product.findOne({_id: id})

    if(!prod) throw new CustomErrors.NotFound(`No product found with id ${id}`)

    const product = await Product.findOneAndUpdate({_id: id}, req.body, { new: true, runValidators: true })

    res.status(200).json({ product })
}

const uploadImage = async (req, res) => {
    const { image: prodImage } = req.files

    const max = 1024 * 1024

    if(!req.files) throw new CustomErrors.BadRequest('Please provide an image')

    if(!prodImage.mimetype.startsWith('image')) throw new CustomErrors.BadRequest('Please upload an image')

    if(prodImage.size > max) throw new CustomErrors.BadRequest('Image cannot be bigger than 1mb')

    const result = await cloudinary.uploader.upload(prodImage.tempFilePath, {
        use_filename: true,
        folder: 'file uploads'
    })

    fs.unlinkSync(req.files.image.tempFilePath)

    res.status(200).json({ src: result.secure_url })
}

module.exports = { getAllProducts, getSingleProduct, addProduct, deleteProduct, updateProduct, uploadImage }
