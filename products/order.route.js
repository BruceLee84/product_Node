const router = require('express').Router();
const Cart = require('../products/cart');
const Order = require('../products/order');
const user = require('../user/user.model')



router.get('/getorder', async(req, res)=>{
    try{
       const uuid = req.query.uuid
       let order = await Cart.findOne({uuid:uuid})
       if(order){
           let data = order.product.length
           let total = order.product
           //console.log(total[0].price);
           let Total =0;
           for(let i=0;i<data;i++){
            Total += total[i].price
           }
           //console.log("total" ,Total)

           const cartData = await Cart.findOneAndUpdate({uuid:uuid},{Total:Total},{new:true}).exec()
           if(cartData){
               res.json({"status":"success", "result":cartData})
           }
       }else{
           res.json({"status":"failed", "message":"Not found"})
       }
   }catch(err){
       return res.status(404).json({"status":"failed", "message":err.message})
   }
})



router.get('/processing', async(req, res)=>{
    // try{
    //     const uuid = req.query.uuid;
    //     await Cart.findByIdAndUpdate({useruuid:uuid},{status:"pending",address:add},{new:true}).exec()
    //     const data = user.findOne({uuid:uuid}).exec()
    //     if(data){
    //     return res.json(data)
    //     }
    // }catch(err){
    //     return res.json(err)
    // }
    
    try{
        const uuid = req.query.uuid
        await user.findOne({uuid:uuid}).exec().then(data=>{
            //const address = data.address
            console.log(address)
           Cart.findOneAndUpdate({userUuid:uuid},{address:address, status:'pending'},{new:true}).exec().then(result=>{
            console.log(result.address);
            res.json({status:'success',message:'your order successed',result}) 
           })
        })
    }catch(err){
        res.json({'err':err.message})
    }
})


router.get('/cancel',async(req,res)=>{
    try{
        const uuid = req.query.uuid
        await Cart.findOneAndUpdate({userUuid:uuid},{status:'cancelled'},{new:true}).exec().then(data=>{
            res.json({status:'success',message:'order is cancelled',data})
        }).catch(err=>{
            res.json({message:err.message})
        })
    }catch(err){
        console.log(err.message);
        res.json({'error':err.message})
    }
})

module.exports = router;