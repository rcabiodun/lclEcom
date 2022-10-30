const mongoose=require('mongoose')
const { User } = require('./User')

const schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        enum:["Fruits","Edibles"],
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    unit:{
        type:String,
        required:true
    },
    image_url:{
        type:String,
    },
    discount_price:{
        type:Number,
        default:0
    },
    is_on_discount:{
        type:Boolean,
        default:false
    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
    
})

module.exports.Product=mongoose.model('Product',schema)