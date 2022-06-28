const authorModel = require("../model/authorModel");
const blogModel = require("../Model/blogModel");
let mongoose = require("mongoose");
const varify = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};

const createBlog = async function (req, res) {
  try {
    let authorId = req.body.authorId;
    let blogData = req.body;
    if (!blogData.title) {
      return res.status(400).send({ status: false, msg: "title is required" });
    }
    if (!blogData.body) {
      return res.status(400).send({ status: false, msg: "body is required" });
    }
    if (!authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "authorId is required" });
    }
    if (!blogData.category) {
      return res
        .status(400)
        .send({ status: false, msg: "category is required" });
    }
    if (!varify(authorId)) {
      return res
        .status(404)
        .send({ status: false, msg: "authorId is not valid" });
    }
    let authorIdfind = await authorModel.findById(authorId);
    if (!authorIdfind) {
      return res
        .status(404)
        .send({ status: false, msg: "author is not exist" });
    }
    let blogcreate = await blogModel.create(blogData);
    if (blogcreate.isPublished == true) {
      let pblog = await blogModel.findByIdAndUpdate(
        { _id: blogcreate._id },
        { $set: { publishedAt: new Date() } },
        { new: true }
      );
      return res.status(201).send({ status: true, data: pblog });
    } else {
      return res.status(201).send({ status: true, data: blogcreate });
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const getBlog = async function (req, res) {
  try {
    let data = req.query;
    if (!data) {
      return res
        .status(400)
        .send({ status: false, msg: "required some query " });
    }
    let query = { isDeleted: false, isPublished: true };
    if (data.authorId) {
      if (!varify(data.authorId)) {
        return res
          .status(404)
          .send({ status: false, msg: "authorId is not valid" });
      } else {
        return (query.authorId = data.authorId);
      }
    }
    if (data.tags) query.tags = { $in: data.tags };
    if (data.category) query.category = data.category;
    let getdata = await blogModel.find(query);
    if (Object.keys(getdata).length > 0) {
      res.status(200).send({ status: true, data: getdata });
    } else {
      res.status(404).send({ status: false, msg: "data not found" });
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const updateBlog = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    let data = req.body;
    
    if (!data) {
      return res
        .status(400)
        .send({ status: false, msg: "Please enter required data" });
    }
    let filterf = {};

    if (data.title) {filterf.title = data.title;}
    if (data.body) {return filterf.body = data.body;}
    let arr = {};
    if (data.tags) {return arr.tags = data.tags;}
    if (data.subcategory) {return arr.subcategory = data.subcategory;}

    let updatedData = await blogModel.findByIdAndUpdate(
      { _id: blogId },
      { $set:{ filterf,isPublished:data.isPublished}, $push: arr },{new:true}
    );
    if (Object.keys(updatedData).length > 0) {

        res.status(200).send({ status: true, msg: updatedData });
      
    } else {
      res.status(404).send({status: false, msg:"data not found"});
    }
  } catch (err) {
    return res.status(500).send({ err: err });
  }
};

const deleteById = async function (req, res) {
  try {
    let data = req.params.blogId;

    if (!varify(data)) {
      return res.status(400).send({ status: false, msg: "Id is not valid" });
    }
    let vari = await blogModel.findById(data);
    if (!vari) {
      return res.status(404).send({ status: false, msg: "Data not found" });
    }
    if (vari.isDeleted == false) {
      await blogModel.findByIdAndUpdate(
        { _id: data },
        { $set: { isDeleted: true, deletedAt: new Date() } }
      );
      res.status(200).send({ status: true, data:""});
    } else {
      res.status(404).send({ status: false, msg: "Data not found" });
    }
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
