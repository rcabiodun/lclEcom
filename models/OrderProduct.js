const { number } = require("joi");
const { default: mongoose } = require("mongoose");
const { Checkout } = require("./checkout");
const { Product } = require('./Product');
const { User } = require("./User");

const schema=new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Product,
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number
    },
    buyer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,

    },
    vendor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
    },
    is_ordered:{
        type:Boolean,
        default:true
    },
    is_delivered:{
        type:Boolean,
        default:false
    },
    is_accepted:{
        type:Boolean,
        default:true
    },
    checkout:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Checkout,

    }
})


module.exports.OrderProduct=mongoose.model('Orderproduct',schema)