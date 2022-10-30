const mongoose=require('mongoose')
const { User } = require('./User')

let schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        unique:true
    },
    address:{
        type:String,
        required:true
    },
    phone_number1:{
        type:Number
    },
    phone_number2:{
        type:Number
    }
    
})

module.exports.Checkout=mongoose.model('Checkout',schema)