const config = require("config");
const jsonwebtoken = require("jsonwebtoken");
const { Membership } = require("../models/Membership");

const moment = require("moment");


//checks for expired memberships
module.exports=async function(req,res,next){
    console.log(req.user_id)
    try{
        let checkingMembership=await Membership.findOne({vendor:req.user_id})
        console.log(moment().diff(checkingMembership.startDate,"years"))
        if (checkingMembership.is_verified==true && moment().diff(checkingMembership.startDate,"years")>0 ){
            checkingMembership.is_pending=true
            checkingMembership.is_verified=false
            checkingMembership.save()
            return res.json({"message":"Your membership has expired"})

        }else if(checkingMembership.is_verified==true && moment().diff(checkingMembership.startDate,"years")==0){
            next()
        }else{
            return res.json({"message":"You are not a member yet"})
        }
    
    
    }catch(err){
        next(err)
    }
    
    

}


