const mongoose = require('mongoose')

const authorSchema = new mongoose.schema({
    fname:{
        type:String,
        
    }, 
    lname: {mandatory}, 
    title: {mandatory, 
        enum[Mr, Mrs, Miss]},
         email: {mandatory, valid email, unique},
          password: {mandatory}




}, {timestamp:true})