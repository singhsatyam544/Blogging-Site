const authorModel=require("../model/authorModel")

const createAuthor=async function (req,res){
try{
    let authordata=req.body
    if(!authordata.fname){
        res.status(404).send("please fill firstName")
    }
    if(!authordata.lname){
        res.status(404).send("please fill LastName")
    }
    if(!authordata.title){
        res.status(404).send("please fill title")
    }
    if(!authordata.email){
        res.status(404).send("please fill email")
    }
    if(!authordata.password){
        res.status(404).send("please fill LastName")
    }
    
    let author=await authorModel.create(authordata)
    res.status(201).send({msg:author})

}catch(err){
    res.status(500).send({"err":err})
}
}



module.exports.createAuthor=createAuthor
