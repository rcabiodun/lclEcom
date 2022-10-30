const c = require("config");
const debug  = require("debug")('app:db');
const { connect } = require("mongoose");
const winston = require("winston");

module.exports=async function(){try{
    await connect(c.get('db'))
    winston.info(`Connection to ${c.get('db')} succesfull`)
    debug(`Connection to ${c.get('db')} succesfull`)
}catch(err){
    debug("Error connections to db")
    winston.error(err.message)
}}