// const { get } = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../Model/blogModel");
const mongoose = require("mongoose")

const createBlog = async function (req, res) {
  try {
    let authorId = req.body.authorId;
    let blogData = req.body;
    let authorIdfind = await authorModel.findById(authorId);
    if (!authorIdfind) {
      res.status(400).send({ msg: "author is not exist" });
    }
    let blogcreate = await blogModel.create(blogData);
    res.status(201).send({ msr: blogcreate });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const getBlogs = async function (req, res) {
    try {
        let data=req.query
        let query={isDeleted:false, 
        isPublished:true}
        if (data.authorId) query.authorId = data.authorId;   
        if (data.tags) query.tags = { $in: data.tags };
        if (data.category) query.category = data.category ;
        let getdata = await blogModel.find(query);
        if (Object.keys(getdata).length>0) { res.status(200).send({ status: true, msg: getdata});
    } else {
            res.status(404).send("data not found");
          }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};
const updateBlogs = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    let updatedData = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      {
        $set: {
          title: data.title,
          body: data.body,
          isPublished: true,
          publishedAt: new Date(),
        },
      }
    );
    let arrayupdate = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $push: { tags: data.tags, subcategory: data.subcategory } },
      { new: true }
    );
    res.send({ msg: arrayupdate });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const varify=function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
  }
  
  const deleteById = async function (req, res) {
    try {
      let data = req.params.blogId;
      if (!data) res.status(400).send("please provide blogId");
  
      if(!varify(data)){return res.status(404).send("Id is not valid")}
  
    let vari = await blogModel.findById({ _id:data} );
    
      if (Object.keys(vari).length==0){res.send({ status: false, msg: "Id is not found in DataBase" });}
      if (vari.isDeleted == false) {
       await blogModel.findByIdAndUpdate({ _id:data},{ $set: { isDeleted: true,deletedAt: Date.now() } }
        );
        res.status(200).send();
      }else{res.status(404).send({ status: false, msg: "no data found" })}
    } catch (err) {
      res.status(500).send({ err: err });
    }
  };
// const deleteById = async function (req, res) {
//   try {
//     let data = req.params;
    
    
//     let query ={isDeleted:false}
//     if(data.authorId) query.authorId = data.authorId
//     if(data.blogId) query.blogId = data.blogId

  
//     let verify = await blogModel.findById({ _id: data.blogId });
//     if (!verify(data.blogId)) { return res.status(404).send({ status: false, msg: "Id is not found in DataBase" })}
    
    
//     let deletedData = await blogModel.updateMany(query,{$set: { isDeleted: true, deletedAt: new Date }})
//     res.status(200).send();
//   } catch (err) {
//     res.status(500).send({ err: err });
//   }
// };

const deleteByQuery = async function (req, res) {
  try {
    let data = req.query;
    if (Object.keys(data).length == 0) {
      return res
        .status(400)
        .send({ status: false, msg: "Please add some query" });
    }
    let query = {};
    if (data.authorId) query.authorId = data.authorId;
    if (data.tags) query.tags = { $in: data.tags };
    if (data.subcategory) query.subcategory = { $in: data.subcategory };
    console.log(query);

    let deletedData = await blogModel.updateMany(query, {
      $set: { isDeleted: true },
    });

    res.send({ status: true, msg: deletedData });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};


module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlogs = updateBlogs;
module.exports.deleteById = deleteById;
module.exports.deleteByQuery = deleteByQuery;
