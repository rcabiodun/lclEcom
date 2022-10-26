const { userValidator, User, LoginValidator, vendorValidator } = require('../models/User')
const bcrypt=require('bcrypt')
const route=require('express').Router()
const asyncMiddleware=require('../middlewares/asyncmiddle')
const decode = require('../middlewares/decode')
const { Membership } = require('../models/Membership')
const { upload } = require('../middlewares/profileuploader')
const { membershipUpload } = require('../middlewares/membershipuploader')
const { uploadToCloudinary } = require('../cloudinaryUploader')



route.post('/registration',asyncMiddleware( async(req,res,next)=>{
    let {error}=userValidator.validate(req.body)
    if (error){
        return next({"message":error.message})
    }
    let existingUser= await User.findOne({phone_number:req.body.phone_number})
    if (existingUser){
        return res.json({"message":"User already exists"})
    }
    let user=new User(req.body)
    user.password=await user.setPassword(req.body.password)

    await user.save()
    res.header('x-auth-token',user.genToken())
    res.json(user)
}))

route.post('/admin/registration',asyncMiddleware( async(req,res,next)=>{
    let {error}=userValidator.validate(req.body)
    if (error){
        return next({"message":error.message})
    }
    let existingUser= await User.findOne({phone_number:req.body.phone_number})
    if (existingUser){
        return res.json({"message":"User already exists"})
    }
    let user=new User(req.body)
    user.password=await user.setPassword(req.body.password)
    user.is_admin=true
    await user.save()
    res.header('x-auth-token',user.genToken())
    res.json(user)
}))

route.post('/vendor/registration',upload,asyncMiddleware( async(req,res,next)=>{
    let {error}=vendorValidator.validate(req.body)
    if (error){
        return next({"message":error.message})
    }
    let existingUser= await User.findOne({phone_number:req.body.phone_number})
    if (existingUser){
        return res.json({"message":"User already exists"})
    }
    let locaFilePath = req.file.path;
    
    let user=new User(req.body)
    let result=await uploadToCloudinary(locaFilePath,req.file)
    if (result.message=="Fail"){
        return res.json({"message":"Image failed to upload"})
    }
    user.password=await user.setPassword(req.body.password)
    user.image_url=result.url
    await user.save()
    let membership=new Membership({
        vendor:user._id
    })
    await membership.save()
    res.header('x-auth-token',user.genToken())
    res.json(user)
}))


route.post('/login',asyncMiddleware(async(req,res,next)=>{
    //console.log(me)
    let {error}=LoginValidator.validate(req.body)
    if(error){
        return next(error)
    }
    let user=await User.findOne({phone_number:req.body.phone_number})
    if (!user){
        return next({message:'User not found'})
    }
    let verifyuser=await bcrypt.compare(req.body.password,user.password)
    if(verifyuser){
        let token=user.genToken()
        res.header('x-auth-token',token)
        res.json(user)
    }else{
        res.json({message:'Password is not correct'})

    }
}))

route.get('/profile',decode,asyncMiddleware(async(req,res,next)=>{
    let user=await User.findOne({_id:req.user_id})
    res.json(user)

}))

route.put('/membership',[decode,membershipUpload],asyncMiddleware(async(req,res,next)=>{
    let membership=await Membership.findOneAndUpdate({vendor:req.user_id},{$set :{ proof_url:`http://127.0.0.1:${process.env.PORT}/membership/${req.file.filename}`}})
    res.json(membership)

}))







module.exports.Userroute=route