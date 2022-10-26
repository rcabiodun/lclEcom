const c = require("config");
const debug  = require("debug")('app:db');
const { connect } = require("mongoose");

module.exports=async function(){try{
    await connect(c.get('db'))
    debug(`Connection to ${c.get('db')} succesfull`)
    console.log(`Connection to ${c.get('db')} succesfull`)
}catch(err){
    debug("Error connections to db")
    console.log(`Error connections to ${c.get('db')}`)

}}