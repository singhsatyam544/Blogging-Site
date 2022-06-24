const jwt = require("jsonwebtoken");
const blogModel=require("../Model/blogModel")

const authenticate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) token = req.headers["X-API-KEY"];
    if (!token) return res.status(400).send({ status: false, msg: "token must be present" });
    let decodedToken = jwt.verify(token, "projectone");
    // console.log(decodedToken.authorId)
    if (!decodedToken) return res.send({ status: false, msg: "token is invalid" });
    req["decodedToken"] = decodedToken;
    next();
  } catch (error) {
    res.status(500).send({ err: error.massage });
  }
};

const authorise = async function (req, res, next) {
  try {
    decodedToken = req["decodedToken"];
    let modifiedAuthor = req.params.blogId;
    let vari = await blogModel.findById({ _id:modifiedAuthor} );
    let validAuthor=vari.authorId
    let loginId = decodedToken.authorId;
    if (validAuthor != loginId) return res.send({ status: false,msg: "User logged is not allowed to modify the requested users data", });
    next();
  } catch (error) {
    res.status(500).send({ err: error.massage });
  }
};

const delByQeury = async function( req, res,next){
  try{
  let data = req.query 
  if(!data) return res.send({status:false, msg:"No data find"})
  let query={isDeleted:false}
  if(data.tags) query.tags = {$in: data.tags}
  if(data.category) query.category = data.category
  if(data.authorId) query.authorId = data.authorId
  if (data.subcategory) query.subcategory = { $in: data.subcategory }
  let allData = await blogModel.findOne(query)
  console.log(allData)
  if(Object.keys(allData).length>0){ decodedToken=req["decodedToken"]
    let authorIdFromQuery= allData.authorId
    let authorIdFromToken = decodedToken.authorId
    if(authorIdFromQuery != authorIdFromToken){
      return res.status(404).send({status:false, err:"user logged is not allowed to delete the requested users data"})
    }
  }
  
  next();
} catch (error) {
  res.status(500).send({ err: error.massage });
}


}


module.exports.authenticate = authenticate;
module.exports.authorise = authorise;
module.exports.delByQeury = delByQeury