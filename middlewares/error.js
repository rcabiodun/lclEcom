const debug=require('debug')('app:error')
module.exports=(err,req,res,next)=>{
    debug('error encountered somewhere')
    debug(err)
    res.status(500)
    res.json({"message":err.message})

}