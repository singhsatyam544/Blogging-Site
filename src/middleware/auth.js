const jwt = require("jsonwebtoken");
const blogModel = require("../Model/blogModel");
let mongoose = require("mongoose");
const varify = function (ObjectId) {
  return mongoose.Types.ObjectId.isValid(ObjectId);
};
const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-API-KEY"];
    if (!token)
      return res
        .status(401)
        .send({ status: false, msg: "token must be present" });

    try {
      const decoded = jwt.verify(token, "projectone");
      req["decodedToken"] = decoded;
    } catch (err) {
      return res.status(401).send({status: false, msg:"Invalid Token"});
    }
    next();
  } catch (error) {
    res.status(500).send({ err: error });
  }
};

const authorise = async function (req, res, next) {
  try {
    decodedToken = req["decodedToken"];
    let modifiedAuthor = req.params.blogId;
    if (!varify(modifiedAuthor)) {
      return res.status(400).send({status: false, msg:"BlogId not valid"});
    }
    let vari = await blogModel.findById(modifiedAuthor);
    if (!vari) {return res.status(404).send({ status: false, msg: "document doesn't exist" });}
    let validAuthor = vari.authorId;
    let loginId = decodedToken.authorId;
    if (validAuthor != loginId)
      return res.status(403).send({
        status: false,
        msg: "User logged is not allowed to modify the requested users data",
      });
    next();
  } catch (error) {
    res.status(500).send({ err: error.massage });
  }
};

const delByQue=  async function (req, res, next) {
  try {
    let data = req.query;
    if (!data) {
      return res.status(400).send({status: false, msg:"required some query "});
    }
    let query = { isDeleted: false };
    if (data.authorId){ if(!varify(data.authorId)){return res.status(404).send({status: false, msg:"authorId is not valid"})}else{return query.authorId = data.authorId;}}
    if (data.tags) query.tags = { $in: data.tags };
    if (data.category) query.category = data.category;
    let getdata = await blogModel.findOne(query);
    if (Object.keys(getdata).length > 0) {
      decodedToken = req["decodedToken"];
      let validAuthor = getdata.authorId;
      let loginId = decodedToken.authorId;
      if (validAuthor != loginId) {
        return res.status(403).send({
          status: false,
          msg: "User logged is not allowed to modify the requested author data",
        });
      }
      req["master"] = getdata._id;
      next();
    } else {
      res.status(404).send({status: false, msg:"document doesn't exist"});
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
};


module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.delByQue = delByQue;
