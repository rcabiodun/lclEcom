const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const { Checkout } = require('../models/checkout')


route.post('/',[decode],asyncMiddleware(async(req,res,next)=>{
    let checkout=new Checkout(req.body)
    checkout.user=req.user_id
    await checkout.save()
    res.json(checkout)
}))

route.put('/',[decode],asyncMiddleware(async(req,res,next)=>{
    let checkout=await Checkout.findOneAndUpdate({user:req.user_id},{$set:req.body},{new:true})
    res.json(checkout)
}))

route.get('/',[decode],asyncMiddleware(async(req,res,next)=>{
    let checkout=await Checkout.findOne({user:req.user_id})
    res.json(checkout)
}))


module.exports.CheckoutRoute=route