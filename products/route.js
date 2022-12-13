const router = require('express').Router();
const moment = require('moment');
//const user = require("../user/user.model");
const watch = require("../products/schema");
const categorySchema = require("../products/category");
const userSchema = require("../user/user.model")
const { find } = require('../products/schema');
const {authverify,isAdmin}=require('../middleware/authVerify')

router.post('/addCategory',isAdmin, async(req,res)=>{
    try{
        const watchData = new categorySchema(req.body);
        const data = await watchData.save()
        return res.status(200).json({status: "success", message: 'category added successfully', result: data})
    }catch(error){
        // console.log(error.message);
        return res.status(404).json({"status": 'failure', 'message': error.message})
    } 
})


router.get('/getCategory', async(req, res)=>{
    try {
        const watchData = await categorySchema.find().exec();
        console.log(watchData)
        if(watchData.length){
           return res.status(200).json({"status":"success", "message":"all category", "result":watchData})
        }else{
            return res.status(400).json({"status":"failed"})
        }
    } catch (error) {
        return res.status(404).json({"Status":"failed", "message": error.meassage})
    }
})


router.get('/category', async(req,res)=>{
    try {
        const categoryId = req.query.categoryId;
        const product = await watch.find({categoryUuid:categoryId}).exec();
        if(product.length){
            return res.status(200).json({"status":"success", "data":product})
        }else{
            return res.status(400).json({"status":"failed", "message":"No data found"})
        }
    } catch (error) {
        return res.status(404).json({"status":"failed", "message":error.message})
    }
})


router.put('/updateCat', async(req,res)=>{
    try{
    let update = req.body.update;
    const watchData = await categorySchema.findOneAndUpdate({uuid:req.body.update.uuid},update,{new:true}).exec()
    return res.json({"status":"success", "message":"update success","resut": watchData})
    }catch(error){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})


router.post('/addNewproduct', async(req, res)=>{
    try{
       //let detail = req.body
       const data = new watch(req.body);
       const result = await data.save();
       if(result){
        return res.status(400).json({status:"success", message:"product added", "result":result})
       }else{
           return res.json({status:"fail",message:err.message})
       }
       
    }catch(err){
        console.log(err.message)
        return res.status(404).json({"status":"failed", "message":err.message})
    }
})

router.get('/getAllproduct', async(req , res)=>{
    try{
        const watchData = await watch.find().exec()
        console.log(watchData)
        if(watchData.length){
        return res.json({"status":"success" ,"message":"All products", "result":watchData})
        }else{
            return  res.json({"status":"failed","message":"Not  Found"})
        }
    }catch(error){
        console.log(error.meassage)
        return res.json({"status":"failed", "meassage":error.meassage})
    }
})


router.get('/getOneProduct', async(req , res)=>{
    try{
        const watchData = await watch.find({uuid:req.query.uuid}).exec()
        if(watchData){
            return res.json({"status":"success", "meassage":"find one product","result":watchData})
        }else{
            return res.json({"status":"failed", "message":"error found"})
        }

    }catch(err){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})


router.get('/getCatproduct', async(req , res)=>{
    try{
        const cat = req.query.cat
        const watchData = await watch.find({categoryUuid:cat}).exec()
        console.log(watchData)
        if(watchData){
            return res.json({"status":"success", "meassage":"find one product", "result":watchData})
        }else{
            return res.json({"status":"failed", "message":"error found"})
        }

    }catch(err){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})


router.put('/updateProduct', async(req,res)=>{
    try{
    let update = req.body.update;
    const watchData = await watch.findOneAndUpdate({uuid:req.body.update.uuid},update,{new:true}).exec()
    return res.json({"status":"success", "message":"update success","resut": watchData})
    }catch(error){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})

router.delete('/deleteProduct', async(req, res)=>{
    try{
        await watch.findOneAndDelete({watchBrand:req.query.watchBrand}).exec()
        return res.json({"status":"success", "message":"product deleted"}) 
    }catch(error){
        return res.status(404).json({"status":"failed" , "message":error.meassage})
    }
})

router.get('/categoryProduct', async(req, res)=>{
    try{
  
    let watchData = await categorySchema.aggregate([
    //    {
    //        $match:{
    //            $and:[
    //                {uuid:"CATEGORY039EE0B645A9"},
    //                {useruuid:"user74D474D9F14F"}
    //            ]
    //        }
    //     },
         {
            $lookup:{
                from: 'watches',
                localField: 'Uuid',
                foreignField: 'categoryUuid',
                as:'watch_data'
            }
        },
        {
            $lookup:{
                from:'user',
                localField:'adminUuid',
                foreignField:'Uuid',
                as:'user_data'
            }
        },
        {
            $project:{
                "_id":0,
                "createdAt":0,
                "updatedAt":0,
                "uuid":0,
                "__v":0
            }
        }

     
    ])
    if(watchData.length){
        return res.json({"status":"success", "message":"fetching successfully", "result":watchData})
    }else{
        return res.json({"status":"failed","message":"Not found"})
    }
    }catch(err){
        return res.status(404).json({"status":"failed","message":err.meassage})
    }
})


router.get('/filerProducts', async (req, res)=>{
    try{
        let minimum = req.query.minimum;
        let maximum = req.query.maximum;
        let min = parseInt(minimum);
        let max = parseInt(maximum)
    
       const watchData = await watch.aggregate([
            {
                $match:{
                    $and:[
                        {price:{
                            $gt: min,
                            $lte: max

                        }}
                    ]
                }
           
        },
        {
            $project:{
                "_id":0,
                "uuid":0,
                "categoryUuid":0,
                "createdAt":0,
                "updatedAt":0,
                "userUuid":0,
                "__v":0
            }
        }
        ])


        if(watchData){
            return res.json({"status":"success", "message":"filterd products", "result":watchData})
        }else{
            return res.json({"status":"failed", "message":"Not fund"})
        }
    }catch(error){
        return res.status(404).json({"status":"failed", "message":error.meassage})
    }
})


router.get('/searchProduct', async(req , res)=>{
    try{
        const watchData = await watch.findOne({watchBrand:req.query.watchBrand}).exec()
        if(watchData){
            return res.json({"status":"success", "meassage":"find one product","result":watchData})
        }else{
            return res.json({"status":"failed", "message":"error found"})
        }

    }catch(err){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})


router.get('/search', async(req, res)=>{
    try {
        const watchData = await watch.find({watchBrand:{$regex: req.query.watchBrand, $options:"i"}}).exec();
        if(watchData){
            return res.status(200).json({"Status":"success", "message":"search data", "result":watchData})
        }else{
            return res.status(400).json({"status":"failed"})
        }
    } catch (error) {
        return res.status(404).json({"status":"failed", "message":error.message})
    }
})



module.exports = router;