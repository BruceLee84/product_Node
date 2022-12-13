const router = require("express").Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cors = require("cors");
const moment = require("moment");
const jwt =require("jsonwebtoken");
const multer = require("multer");
const xlsx = require("xlsx");
const {joivalidation} = require("../middleware/joi")
const user =require("./user.model");   //("../user/user.model")
// const fast2sms = require('fast-two-sms');
const mailsend = require('../middleware/email');
const storage = require('../middleware/multer');
const res = require("express/lib/response");
const product = require('../products/schema')
//const { watch } = require("./user.model");



const upload = multer({storage:storage.store})
//console.log(upload)
router.post('/signUP',async(req,res)=>{
    console.log(req.body) 
   try{
    let Name = req.body.Name;
    let email =req.body.email;
    let mobileNumber =req.body.mobileNumber;
    let address =req.body.address;
    
     if(Name){
        let usernameDetail = await user.findOne({'Name':Name}).exec()
        if(usernameDetail){
            return res.json({status: 'failed', message:'user name exist'})
        }
    }else{
        return res.status(404).json({status:'failed',message:'use another user name'})
    }

    if(email){
        let emailDetail =await user.findOne({'email':email}).exec()
        if(emailDetail){
            return res.json({status:'failed', message:'email id exit'})
        }
    }else{
        return res.status(404).json({status:'failed',message:'use another email id'})
    }

     if(mobileNumber){
         let mobileNumberDetail = await user.findOne({'mobileNumber':mobileNumber}).exec()
         if(mobileNumberDetail){
             return res.json({status:'failled',message:'mobile number exist'})
         }
     }else{
         return res.status(404).json({status:'failed', message:'use another mobile number'})
     }

        //let detail = await joivalidation.validateAsync(req.body)
        let userDetail = new user(req.body);
        if(req.body.setPassword){
        let setPassword = req.body.setPassword;
        const salt = await bcrypt.genSalt(10);
        userDetail.setPassword = bcrypt.hashSync(setPassword,salt); 
     }
     
     const result = await userDetail.save();
    
     if(result){
        const toEmail= result.email;
        const subject= "mail"
        //const text = req.body.text;
        var mailData= {
            // from:process.env.userEmail,
            from:'thorodinson00t@gmail.com',
            to: toEmail,
            subject: subject,
            fileName:'email.ejs',
            detail:{Name:userDetail.Name}
            }
            console.log(userDetail.Name)
            
             
      let data = await mailsend.mailSending(mailData);

     return res.json({status:'success',message:'userDetail successfully added!','result':result});
     }
    }catch(error){
        return res.status(404).json({status:'failed', message:error.message})    
    }
    })



router.get('/activate/:Name', async(req, res)=>{
    try{
        //console.log("req.params.Name",req.params.Name)
        data =await user.findOneAndUpdate({Name:req.params.Name},{active:true},{new:true}).exec()
        if(data){
            console.log("Account actived")
         }
         res.send('<h3>Account ctivated</h3>');
       
   }catch(error){
        return res.status(404).jason({"ststus":"failed", "message":error.message})
    }
})


    

    router.post('/login',async(req,res)=>{
        try{
        let Name = req.body.Name;
        let setPassword = req.body.setPassword;
        await user.findOneAndUpdate({Name:Name},{loginStatus:true},{new:true}).exec();
        let userDetail = await user.findOne({Name:Name},{"result":setPassword}).select('setPassword').exec()

        if(Name){
            userDetail = await user.findOne({Name:Name}).exec()
            if(!userDetail){
                return res.status(400).json({status: "failure", message: "please signup first"});
            }
        }else{
            return res.status(400).json({status: "failure", message: "Please enter the userName"})
        }
        if(userDetail){
            let isMatch = await bcrypt.compare(setPassword, userDetail.setPassword)
            if(userDetail!== true){
        //await user.findOneAndUpdate({uuid:userDetail.uuid},{loginStatus:true}).exec();
            }
            //let payload = {uuid: userDetails.uuid, role: userDetails.role}
           
            if(isMatch){
                var userData = userDetail.toObject()
                console.log(userData);
                let jwttoken = jwt.sign({uuid:userData.uuid},process.env.SuperKEY, {expiresIn:'2h'})
                userData.jwttoken = jwttoken

                // token = otp.otp('send')
                // await user.findOneAndUpdate({uuid:userDetail.uuid}, {otp: token}, {new:true}).exec() 
                // var otpsms = {
                //     authorization:process.env.fast2smskey,
                //     message: "your otp "+token, 
                //     numbers:[userDetail.mobileNumber]
                // };
                // fast2sms.sendMessage(otpsms).then((response)=>{
                //     console.log(response)
                // })

                return res.status(200).json({status: "success", message: "Login successfully",userData:userData})
            }else{
            return res.status(400).json({status: "failed", message: "Login failed"})
        }
    }
                
          
     

    }catch(error){
        console.log(error.message)
        return res.status(500).json({status: "failed", message: error.message})
    }
    })


    router.post("/logout", async(req,res)=>{
        try {
            let Date = moment().toDate();
            console.log(Date)
           const data = await user.findOneAndUpdate({uuid: req.body.uuid},{loginStatus:false,lastVisted:Date},{new:true}).exec()
            return res.status(200).json({status: "success", message: "Logout success",'result':data})
        } catch (error) {
            console.log(error.message)
            return res.status(500).json({status: "failure", message: error.message})
        }
    })

    
    // router.post('/mailSender',async (req,res)=>{
    //     try{
    //         const toEmail=req.body.toEmail;
    //         const subject= req.body.subject;
    //         //const text = req.body.text;
    //         var mailData= {
    //             from:process.env.userEmail,
    //             to: toEmail,
    //             subject: subject,
    //             fileName:'email.ejs',
    //             }
                 
    //       let data = await mailsend.mailSending(mailData);
    //         return res.status(200).json({status:'success', message:'mail sended'})
    //     }catch(error){
    //         res.status(404).json({status:'failed', message:error.message})
    //     }
    // })
    

    router.post('/fileupload', upload.single('file'), async(req, res)=>{
    try{
        let path = './upload/' + req.file.filename;
        console.log(path)
        let excel = xlsx.readFile(path)
        let xlsheet = excel.SheetNames
        let data = xlsx.utils.sheet_to_json(excel.Sheets[xlsheet[0]])

        console.log(data)
        console.log(xlsheet)

       for(const x of data){
           const data1 = new product(x)
           const result = await data1.save();
             console.log(result)
       }
        return res.json({"status":"success", "message":"file uploaded", "result":data})
    }catch(err){
         return res.json({"status":"failed", "message":err.message})
    }    
    })
   


module.exports =router;