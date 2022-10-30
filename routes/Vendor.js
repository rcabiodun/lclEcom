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
const { OrderProduct } = require('../models/OrderProduct')

let pagesize=1
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

route.put('/product/update/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{

    let product=await Product.findOneAndUpdate({_id:req.params.id},{$set:req.body},{new:true}).populate('vendor')
    if(product.discount_price>0){
        product.is_on_discount=true
        product.save()
    }
    res.json(product)
}))

//vendor sees the details of a product he/she created
route.get('/product/detail/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{

    let product=await Product.findOne({_id:req.params.id}).populate('vendor')
    res.json(product)
}))

//list of products belonging to a vendor
route.get('/product/list',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{
    let products=await Product.find({vendor:req.user_id}).limit(pagesize).skip(pagesize*(req.query.pagenum-1)).populate('vendor')
    res.json(products)
}))

//List of products that have just been ordered
route.get('/incoming/orders',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{
    let products=await OrderProduct.find({vendor:req.user_id,is_accepted:true,is_delivered:false}).limit(pagesize).skip(pagesize*(req.query.pagenum-1)).populate('checkout').populate('product')
    res.json(products)

}))

//reject a product that has been ordered
route.put('/reject/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{
    let product=await OrderProduct.findOneAndUpdate({_id:req.params.id},{$set:{
        is_accepted:false
    }},{new:true })
    res.json(product)

}))

//setting is delivered
route.put('/deliver/:id',[decode,membershipchecker],asyncMiddleware( async(req,res,next)=>{
    let product=await OrderProduct.findOneAndUpdate({_id:req.params.id},{$set:{
        is_delivered:true,
        is_accepted:false
    }},{new:true })
    res.json(product)

}))





module.exports.vendorRoute=route