const authorModel=require("../model/authorModel")
const jwt = require("jsonwebtoken");



titver=function (tit){
  if(tit==="Mr"){
    return "Mr"
  }else if(tit=="Miss"){
    return "Miss"
  }else if(tit=="Mrs"){
    return "Mrs"
  }else{
    return null
  }
}

const createAuthor=async function (req,res){
try{

    let authordata=req.body
    if(!authordata.fname){
        return res.status(400).send({ status: false, msg: "please fill firstName" })
    }
    if(!authordata.lname){
        return res.status(400).send({ status: false, msg: "please fill LastName" })
    }
    if(!authordata.title){
       return res.status(400).send({ status: false, msg: "please fill title" })
    }
  

    if(!titver(authordata.title)){
      return res.status(400).send({ status: false, msg: 'please use only these titles "Mr","Mrs","Miss"' })
    }
    if(!authordata.email){
       return res.status(400).send({ status: false, msg: "please fill email" })
    }
    
    if(!authordata.password){
        res.status(400).send({ status: false, msg: "please fill password"})
    }
    
    let emaildata=await authorModel.find({email:authordata.email})

    if(Object.keys(emaildata).length > 0){
      return res.status(400).send({ status: false, msg: "use different emailId" })
    }else{
      let author=await authorModel.create(authordata)
     return res.status(201).send({status: true,msg:author})
    }

}catch(err){
  console.log(err)
   return res.status(500).send({"err":err});
   
}
}

const loginAuthor = async function (req, res) {
  try {
    let emailId = req.body.email;
    if(!emailId){return res.status(400).send({status: false,msg:"please provide email"})};
    let key = req.body.password;
    if(!key){return res.status(400).send({status: false,msg:"please provide password"})};
  
    let user = await authorModel.findOne({ email: emailId, password: key });
    if (!user)
      return res.status(401).send({
        status: false,
        msg: "email or the password is not corerct",
      });
  
  
    let token = jwt.sign(
      {
        authorId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
      },
      "projectone"
    );
   return res.status(200).send({ status: true, token: token , authorId:user._id});
  } catch (error) {
   return res.status(500).send({ err: error });
  }
  };

module.exports.loginAuthor=loginAuthor
module.exports.createAuthor=createAuthor