const mongoose=require('mongoose')
const { User } = require('./User')

let schema=new mongoose.Schema({
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    is_verified:{
        type: Boolean,
        default:false
    },
    proof_url:{
        type:String
        
    },
    startDate:{
        type:Date
    },
    is_pending:{
        type: Boolean,
        default:true

    }
})

module.exports.Membership=mongoose.model('Membership',schema)