const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
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
        enum:['Mr', 'Mrs', 'Miss'],
        require:true
    },
    email: {
        type:String,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
        require:true,
        unique:true
    },
    password: { 
        type: String,
         required: true 
    }    

}, {timestamps:true})

module.exports = mongoose.model('Author', authorSchema)