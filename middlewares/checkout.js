const { Membership } = require("../models/Membership");

const moment = require("moment");
const { Checkout } = require("../models/checkout");


//checks for expired memberships
module.exports.checkForm=async function(req,res,next){
    console.log(req.user_id)
    try{
        let CO= await Checkout.findOne({user:req.user_id})
        if(CO){
            req.checkout=CO._id
            next()
        }else{
            return res.json({message:"Create a checkout form please"})
        }
    }catch(err){
        next(err)
    }
    
    
}