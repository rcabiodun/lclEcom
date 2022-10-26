const { userValidator, User, LoginValidator, vendorValidator } = require('../models/User')
const bcrypt=require('bcrypt')
const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const membershipchecker = require('../middlewares/membershipchecker')
const { Product } = require('../models/Product')




route.get('/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{

    let product=Product.findOne({_id:req.params.id}).populate('vendor')
    res.json(product)
}))


module.exports.productRoute=route