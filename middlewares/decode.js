const config = require("config");
const jsonwebtoken = require("jsonwebtoken");
const { Membership } = require("../models/Membership");

const moment = require("moment");


module.exports=async function(req,res,next){
    let token=req.header('x-auth-token')
    if (!token){
        res.json({message:"Token is not present"})
    }
    try{
        const decode=jsonwebtoken.verify(token,'peaklane')
        req.user_id=decode.user
    req.is_admin=decode.is_admin
    req.is_vendor=decode.is_vendor
    console.log(req.is_admin)
    console.log(req.is_vendor)
    
    next()
    }catch(err){
        next(err)
    }
    
    

}


