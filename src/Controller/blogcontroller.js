const authorModel = require("../model/authorModel");
const blogModel = require("../Model/blogModel");
let mongoose=require("mongoose");
const varify=function(ObjectId){
  return mongoose.Types.ObjectId.isValid(ObjectId)
}


const createBlog = async function (req, res) {
  try {
    let authorId = req.body.authorId;
    let blogData = req.body;
    if(!blogData.title){return res.status(400).send({  status: false, msg: "title is required" });}
    if(!blogData.body){return res.status(400).send({ status: false, msg: "body is required" });}
    if(!authorId){return res.status(400).send({ status: false, msg: "authorId is required" });}
    if(!blogData.category){return res.status(400).send({ status: false, msg: "category is required" });}
    if(!varify(authorId)){return res.status(404).send({ status: false, msg: "authorId is not valid" })}
    let authorIdfind = await authorModel.findById(authorId);
    if (!authorIdfind) {
      return res.status(404).send({status: false, msg: "author is not exist" });
    }
    let blogcreate = await blogModel.create(blogData);
    res.status(201).send({status: true,  msg: blogcreate });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const getBlog =async function (req, res) {
  try {
    let data = req.query;
    if(!data){return res.status(400).send({status: false,msg: "required some query "})}
    let query = { isDeleted: false, isPublished: true };
    if (data.authorId){ if(!varify(data.authorId)){return res.status(404).send({status: false, msg:"authorId is not valid"})}else{return query.authorId = data.authorId;}}
    if (data.tags) query.tags = { $in: data.tags };
    if (data.category) query.category = data.category;
    let getdata =await blogModel.find(query);
    if (Object.keys(getdata).length > 0) {
      res.status(200).send({ status: true, msg: getdata });
    } else {
      res.status(404).send({status: false, msg:"data not found"});
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};


const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    if(!data){return res.status(400).send({status: false, msg:"Please enter required data"});}
    let query = { isPublished: true, publishedAt: new Date };
    if (data.title) query.title = data.title;
    if (data.body) query.body = data.body;
    let arr = {};
    if (data.tags) arr.tags = data.tags;
    if (data.subcategory) arr.subcategory = data.subcategory;
    let updatedData = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set: query }
    );

    if (Object.keys(updatedData).length > 0) {
      let arrayupdate = await blogModel.findByIdAndUpdate(
        { _id: blogId },
        { $push: arr },
        { new: true }
      );
      if (Object.keys(arrayupdate).length > 0) {
        res.status(200).send({ status: true, msg: arrayupdate });
      }else{res.status(404).send({status: false, msg:"data not found"});}
    } else {
      res.status(404).send({status: false, msg:"data not found"});
    }
  } catch (err) {
    res.status(500).send({ err: err.massage });
  }
};



const deleteById = async function (req, res) {
  try {
    let data = req.params.blogId;

    if(!varify(data)){return res.status(400).send({status: false, msg:"Id is not valid"})}
    let vari = await blogModel.findById(data);
    if (!vari){return res.status(404).send({ status: false, msg: "Data not found" });}
    if (vari.isDeleted == false) {
     await blogModel.findByIdAndUpdate({ _id:data},{ $set: { isDeleted: true,deletedAt: new Date } }
      );
      res.status(200).send();
    }else{res.status(404).send({ status: false, msg: "Data not found" })}
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const deleteByQuery =  async function (req, res) {
    try {
      que=req["master"]
      let deletedData = await blogModel.findByIdAndUpdate(que, {$set: { isDeleted: true,deletedAt:new Date }});
      if(deletedData){return res.status(200).send({ status: true, msg:"" });
    }else{res.status(404).send({ status: false, msg:"no data found" });} 
    } catch (error) {
      res.status(500).send({ err: error });
    }
};


module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;




// function name(params) {
  
// }
  // const deleteByQuery =  async function (req, res) {
  //   try {
  //     que=req["master"]
  //     console.log(que)
  //     // let data = req.query;
  //     // if (Object.keys(data).length == 0) {return res.status(400).send({ status: false, msg: "Please add some query" });}
  //     // let query = {};
  //     // if (data.authorId) {if(!varify(data.authorId)){return res.status(404).send("authorId is not valid")}else{query.authorId = data.authorId;}}
  //     // if (data.tags) query.tags = { $in: data.tags };
  //     // if (data.subcategory) query.subcategory = { $in: data.subcategory };
  //     // if(data.unPublished) query.isPublished=false;
  //     // if(data.isPublished) query.isPublished=query.isPublished

  //     let deletedData = await blogModel.findByIdAndUpdate(que, {$set: { isDeleted: true,deletedAt:new Date }});
  //     res.send({ status: true, msg: deletedData });
  //   } catch (error) {
  //     res.status(500).send({ err: error });
  //   }
  // };



  // const deleteByQuery =  async function (req, res) {
  //   try {
  //     let data = req.query;
  //   if(!data){return res.status(400).send("required some query ")}
  //   let query = {};
  //   if (data.authorId) query.authorId = data.authorId;
  //   if (data.tags) query.tags = { $in: data.tags };
  //   if (data.category) query.category = data.category;
  //   // if(!varify(data.authorId)){return res.status(404).send("authorId is not valid")}
  //   let getdata = await blogModel.find(query);
  //     if(!getdata){return res.status(404).send({ status: false, msg: "no data found" })}
  //     // if(getdata.isDeleted==false){
  //       let deletedData = await blogModel.findOneAndUpdate(getdata, {$set: { isDeleted: true,deletedAt:new Date }});
  //       res.send({ status: true, msg: deletedData });
  //     // }else{return res.status(404).send({ status: false, msg: "no data found" })}
  //   } catch (error) {
  //     res.status(500).send({ err: error });
  //   }
  // };




// const word = "freecodecamp"

// const firstLetter = word.charAt(9
//   )
// console.log(firstLetter)