const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
    }, 
    body: {
        type:String,
        require:true
    }, 
    authorId: {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
         ref:'Authors'
        },
    tags:Array, 
    category: {
        type:String, 
        require:true
    }, 
    subcategory: {
        type:Array
    }, 
    isDeleted: {
        type:Boolean, 
        default:false
    }, 
    publishedAt: {
        type :Date
    }, 
    deletedAt:{
        type:Date
    },
    isPublished: {
        type:Boolean, 
        default: false
    }

}, {timestamps:true})

module.exports = mongoose.model('Blogs', blogSchema)

