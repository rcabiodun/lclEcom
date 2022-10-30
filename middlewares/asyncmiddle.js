const winston = require("winston")

module.exports=function(func){
    return (async function(req,res,next){
        try{
            await func(req,res,next)

        }catch(err){
            winston.error(err.message,err)
            next(err)
        }

    })

}