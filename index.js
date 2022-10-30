const express = require('express');
const db=require('./startup/db')
const debug=require('debug')('app:root')
const fs=require('fs')
const winston=require('winston')
require('winston-mongodb')
const c = require("config");
app=express()
port=process.env.PORT || 8000
db()
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
  
winston.add(new winston.transports.File({filename:'logfile.log'}))
winston.add(new winston.transports.MongoDB({db:c.get('db')}),)
require('./startup/starter')(app)
require('./startup/prod')(app)
app.listen(port,(msg)=>{
    debug(`Server is running on port --> ${port}`)
})