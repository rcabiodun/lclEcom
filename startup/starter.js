const express = require('express');
const { Userroute } = require('../routes/User');
const morgan = require('morgan');
const errorMiddle=require('../middlewares/error');
//const { adminRoute } = require('../routes/admin');
const { productRoute } = require('../routes/Product');
const { Membershiproute } = require('../routes/Membership');
const { vendorRoute } = require('../routes/Vendor');
const prod = require('./prod');


module.exports=function(app) {
    app.use(morgan('dev'))
    app.use(express.json())
    app.use('/profile',express.static('./images/profile'))
    app.use('/products',express.static('./images/products'))
    app.use('/membership',express.static('./images/membership'))
    app.use("/uploads", express.static("uploads"));
    
    app.use('/account',Userroute)
    //app.use('/admin',adminRoute)
    app.use('/vendor',vendorRoute)
    app.use('/membershipstatus',Membershiproute)
    
    app.use(require('../middlewares/notfound'))
    app.use(errorMiddle)
    
}
