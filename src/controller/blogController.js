const authorModel=require("../model/authorModel")
const blogModel=require('../Model/blogModel')

const createBlog=async function (req,res){
try{
    let authorId=req.body.authorId
    let blogData=req.body
    let authorIdfind=await authorModel.findById(authorId)
    if(!authorIdfind){res.status(400).send({msg:"author is not exist"})}
    let blogcreate=await blogModel.create(blogData)
    res.status(201).send({msr:blogcreate})

}catch(err){
    res.status(500).send({"err":err})
}
}

const getBlogs = async function( req, res){
    try {
        let getBlogsData = await blogModel.find({isDeleted:false,isPublished:true})
        if(getBlogsData.length>0)  res.status(200).send({status:true, data: getBlogsData})
        // Filter blogs list by applying filters. Query param can have any combination of below filters.
        // By author Id
        // By category
        // List of blogs that have a specific tag
        // List of blogs that have a specific subcategory example of a query url: blogs?filtername=filtervalue&f2=fv2
        else res.status(404).send("data not find")
       
    } catch (err) {
    res.status(500).send({"err":err})        
    } 
}
const updateBlogs = async function( req, res){

    let blogId = req.params.blogId
    console.log(blogId)
    let data =req.body
    let updatedData= await blogModel.findByIdAndUpdate({_id:blogId},{ $set:{"title":data.title,"body":data.body, }} ,
    {$push:{"tags":data.tags,"subcategory":data.subcategory},})
    res.send({msg: updatedData})
}




module.exports.createBlog=createBlog
module.exports.getBlogs= getBlogs
module.exports.updateBlogs= updateBlogs
