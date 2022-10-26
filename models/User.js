const { genSalt, hash } = require('bcrypt')

const Joi = require('joi')
const { sign } = require('jsonwebtoken')
const mongoose=require('mongoose')

let schema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone_number:{
        type:Number,
        required:true,
        unique:true
    },
    location:{
        type:String,
        enum:["Lagos","Ogun"]
    },
    email:{
        type:String,
        required:true
    },
    business_name:{
        type:String,
    
    },
    image_url:{
        type:String
    },
    is_vendor:{
        type:Boolean,
        default:false
    },
    is_admin:{
        type:Boolean,
        default:false
    
    },
    account_number:{
        type:Number
    },
    password:{
        type:String,
        required:true
    }
})
schema.method('setPassword',async function(pwrd) {
    let salt=await genSalt(10)
    
    console.log(this.password)
    return (await hash(pwrd,salt))
})

schema.method('genToken', function() {
    return sign({user:this._id,is_admin:this.is_admin,is_vendor:this.is_vendor},"peaklane")
})




let User=mongoose.model('User',schema)

let userValidator=Joi.object({
    name:Joi.string().min(3).required(),
    phone_number:Joi.number().required(),
    location:Joi.string().required(),
    email:Joi.string().required().email(),
    password:Joi.string().min(3).required(),

})

let vendorValidator=Joi.object({
    name:Joi.string().min(3).required(),
    business_name:Joi.string().min(3).required(),
    phone_number:Joi.number().required(),
    location:Joi.string().required(),
    email:Joi.string().required().email(),
    password:Joi.string().min(3).required(),
    account_number:Joi.string().min(5).required()
})


const LoginValidator=Joi.object({
    
    phone_number:Joi.number().required(),
    password:Joi.string().min(3).required(),

})


module.exports.User=User
module.exports.userValidator=userValidator
module.exports.LoginValidator=LoginValidator
module.exports.vendorValidator=vendorValidator