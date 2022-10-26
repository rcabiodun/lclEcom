const { userValidator, User, LoginValidator, vendorValidator } = require('../models/User')
const bcrypt=require('bcrypt')
const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const { Membership } = require('../models/Membership')
const membershipchecker = require('../middlewares/membershipchecker')
const { Product } = require('../models/Product')
const { productUpload } = require('../middlewares/productuploader')
const { uploadToCloudinary } = require('../cloudinaryUploader')

let pagesize=2
//vendor creates a product
route.post('/product/create',[decode,membershipchecker,productUpload],asyncMiddleware( async(req,res,next)=>{
    let result=await uploadToCloudinary(req.file.path,req.file)
    if (result.message=="Fail"){
        return res.json({"message":"Image failed to upload"})
    }
    let product=new Product(req.body)
    product.vendor=req.user_id
    product.image_url=result.url
    await product.save()
    res.json(product)
}))

//vendor sees the details of a product he/she created
route.get('/product/d/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{

    let product=await Product.findOne({_id:req.params.id}).populate('vendor')
    res.json(product)
}))

//list of products belonging to a vendor
route.get('/product/list',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{
    let products=await Product.find({vendor:req.user_id}).limit(pagesize).skip(pagesize*(req.query.pagenum-1)).populate('vendor')
    res.json(products)
}))



module.exports.vendorRoute=route