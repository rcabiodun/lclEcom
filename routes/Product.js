const { userValidator, User, LoginValidator, vendorValidator } = require('../models/User')
const bcrypt=require('bcrypt')
const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const membershipchecker = require('../middlewares/membershipchecker')
const { Product } = require('../models/Product')
const { OrderProduct } = require('../models/OrderProduct')
const { checkForm } = require('../middlewares/checkout')


let pagesize=1


route.get('/detail/:id',[decode],asyncMiddleware( async(req,res,next)=>{

  let product=await Product.findOne({_id:req.params.id}).populate('vendor')
    res.json(product)
}))

//products by current users location
route.get('/all',[decode],asyncMiddleware( async(req,res,next)=>{
    let currentUser=await User.findOne({_id:req.user_id})
    //console.log(currentUser._id)
    let vendors=await User.find({is_vendor:true,location:currentUser.location}).limit(pagesize).skip(pagesize*(req.query.pagenum-1))
    let products=[]
    console.log(vendors.length)
    for(let i=0;i<=vendors.length-1;i++){
        let result=await Product.find({vendor:vendors[i]._id})
        products=products.concat(result)
    }
    console.log(products)
    res.json(products)
    
    
}))
route.post('/search',[decode],asyncMiddleware( async(req,res,next)=>{
    //console.log(currentUser._id)
    let vendors=await User.find({is_vendor:true,location:req.body.location}).limit(pagesize).skip(pagesize*(req.query.pagenum-1))
    let products=[]
    console.log(vendors.length)
    for(let i=0;i<=vendors.length-1;i++){
        let result=await Product.find({vendor:vendors[i]._id,category:req.body.category})
        products=products.concat(result)
    }
    console.log(products)
    res.json(products)
    
    
}))





route.post('/buy/:id',[decode,checkForm],asyncMiddleware((async(req,res,next)=>{
    let product= await Product.findOne({_id:req.params.id})
    let vendor= await User.findOne({_id:product.vendor._id})
    let orderproduct=new OrderProduct({
        product,
        quantity:req.body.quantity,
        buyer:req.user_id,
        vendor,
        checkout:req.checkout
        
    })
    if (product.is_on_discount){
        orderproduct.price=product.discount_price * req.body.quantity
    }else{
        orderproduct.price=product.price * req.body.quantity
    }
    await orderproduct.save()
    
    res.json(orderproduct)
})))

route.get('/ordered',[decode,checkForm],asyncMiddleware((async(req,res,next)=>{
    let Op= await OrderProduct.find({buyer:req.user_id,is_ordered:true,is_delivered:false,is_accepted:true}).populate('vendor').populate('product')
    
    res.json(Op)
})))


//route.get('/')

//delete orderedProduct

module.exports.productRoute=route