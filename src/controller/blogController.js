const { get } = require("mongoose");
const authorModel = require("../model/authorModel");
const blogModel = require("../Model/blogModel");

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
    let getBlogsData = await blogModel.find({
      $and: [{ isDeleted: false, isPublished: true }],
    });
    if (getBlogsData.length > 0) {
      let tags = req.query.tags;
      let category = req.query.category;
      let authorId = req.query.authorId;
      let updatedData = await blogModel.find({
        $or: [{ tags }, { category }, { authorId }],
      });
      res.send({ msg: updatedData });
    } else {
      res.status(404).send("data not find");
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

const deleteBlogs = async function (req, res) {
  try {
    let data = req.params;
    let varify = await blogModel.findById({ _id: data.blogId });
    if (!varify) {
      res
        .status(404)
        .send({ status: false, msg: "Id is not found in DataBase" });
    }
    let deletedData = await blogModel.findByIdAndUpdate(
      { _id: data.blogId, isDeleted: false },
      { $set: { isDeleted: true } }
    );

    res.status(200).send();
    if (!deletedData) res.status(404).send({ status: false, msg: "" });
  } catch (err) {
    res.status(500).send({ err: err });
  }
};

const deleteByParams = async function (req, res) {
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
module.exports.deleteBlogs = deleteBlogs;
module.exports.deleteByParams = deleteByParams;
