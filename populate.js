require('dotenv').config()
const connect = require('./db/connectDb')
const Product = require('./models/Product')


const populate = async () => {
    try{
        await connect(process.env.MONGO_URL)
        for(i = 30; i < 50; i++){
            await Product.deleteMany({discount: i})
            console.log(i, 'Success')
        }
        process.exit(0)
    }catch(err) {
        console.log(error)
        process.exit(1)
    }
}

populate()