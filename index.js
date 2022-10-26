const express = require('express');
const db=require('./startup/db')
const debug=require('debug')('app:root')
const fs=require('fs')

app=express()
port=process.env.PORT || 8000
db()
if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}
  

require('./startup/starter')(app)
require('./startup/prod')(app)
app.listen(port,(msg)=>{
    debug(`Server is running on port --> ${port}`)
})