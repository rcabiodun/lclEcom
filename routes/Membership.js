const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const { Membership } = require('../models/Membership')
const { membershipUpload } = require('../middlewares/membershipuploader')
const { uploadToCloudinary } = require('../cloudinaryUploader')




route.put('/',[decode,membershipUpload],asyncMiddleware(async(req,res,next)=>{
    let result=await uploadToCloudinary(req.file.path,req.file)
    if (result.message=="Fail"){
        return res.json({"message":"Image failed to upload"})
    }

    let membership=await Membership.findOneAndUpdate({vendor:req.user_id},{$set :{proof_url:result.url,category:req.body.category}},{new:true})
    res.json(membership)

}))

route.get('/get',decode,asyncMiddleware(async(req,res,next)=>{
    let membership=await Membership.findOne({vendor:req.user_id})
    res.json(membership)

}))






module.exports.Membershiproute=route