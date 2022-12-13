const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../user/user.model");
require('dotenv').config();

function authverify (req, res, next){
    try{
       let token = req.header("token");
       console.log("Token", token);
       if(!token){
           return res.json({"status":"failed", "message":"unauthoriced"})
       } 
       const decode = jwt.verify(token, process.env.SuperKEY);
       console.log("Decode", decode);
       next();

    }catch(err){
        console.log(err.message)
        return res.status(404).json({"status":"failed", "message":err.message})
    }
}


function isAdmin (req, res, next){
    try{
        
        let token = req.header("token");
        
        if(!token){
            return res.json({"status":"failed",  "message":"unauthoriced"})
        }
        const decode = jwt.verify(token, process.env.SuperKEY)
        console.log(decode.uuid)
        console.log("succees")
        const userdata = user.findOne({uuid:decode.uuid}).exec().then(data=>{
         if(data.role == "admin"){
            console.log("welcome back admin")
            next();
         
        }else{
            return res.json({"status":"failed", "message":"only access admin"})
        }
    })
    }catch(error){
        return res.status(404).json({"status":"failed", "message":error.message})
    }
}




module.exports ={authverify,isAdmin}