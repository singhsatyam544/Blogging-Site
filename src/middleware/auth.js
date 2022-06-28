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



module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.delByQue = delByQue;
