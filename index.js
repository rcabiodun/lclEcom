const express = require('express');
const db=require('./startup/db')
const debug=require('debug')('app:root')
const { Userroute } = require('./routes/User');
const morgan = require('morgan');
const errorMiddle=require('./middlewares/error')
const fs=require('fs')
app=express()
port=process.env.PORT || 8000
db()
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
  

require('./startup/starter')(app)
app.listen(port,(msg)=>{
    debug(`Server is running on port --> ${port}`)
})