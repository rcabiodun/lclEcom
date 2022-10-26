const { userValidator, User, LoginValidator, vendorValidator } = require('../models/User')
const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const { Membership } = require('../models/Membership')

let pagesize=5


//admin views the vendors queing up to become members
route.get('/pending/members',decode,asyncMiddleware(async(req,res,next)=>{
    let pendingMembers=await Membership.find({is_pending:true}).limit(pagesize).skip(pagesize*(req.query.pagenum-1)).populate('vendor')
    
    res.json(pendingMembers)


}))


//admin approves the vendor to become a member
route.get('/verify/:member',decode,asyncMiddleware(async(req,res,next)=>{
    let verifiedMember=await Membership.findOneAndUpdate({_id:req.params.member},{$set:{is_pending:false,is_verified:true,startDate:new Date().toJSON().slice(0, 10)}},{new:true})
    
    let vendor=await User.findOneAndUpdate({_id:verifiedMember.vendor},{$set:{is_vendor:true}},{new:true})

    
    res.json(verifiedMember)


}))

route.get('/detail/:member',decode,asyncMiddleware(async(req,res,next)=>{
    let verifiedMember=await Membership.findOne({_id:req.params.member}).populate('vendor')
    res.json(verifiedMember)


}))



module.exports.adminRoute=route