const mongoose = require('mongoose')

const authorSchema = new mongoose.schema({
    fname:{
        type:String,
        require: true
    }, 
    lname: {
        type:String,
        require:true
    }, 
    title: {
        type:String,
        enum:[Mr, Mrs, Miss],
        require:true
    },
    email: {
        type:String,
        require:true,
        unique:true
    },
    password: { 
        type: String,
         required: true 
    }    

}, {timestamp:true})

module.exports = mongoose.model('Author', authorSchema)