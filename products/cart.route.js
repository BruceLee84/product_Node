const router = require('express').Router();
const req = require('express/lib/request');
const Cart = require('../products/cart');
const watch = require('../products/schema');




router.get('/allproduct', async(req, res)=>{
    try{
        const data = await watch.find().exec();
        if(data.length){
            return res.json(data)
     }
    }catch(err){
        return res.json(err)
    }
})



router.get('/search', async(req , res)=>{
    try{
        const cart = await Cart.findOne({useruuid:req.query.useruuid}).exec()
        if(cart){
            return res.json({"status":"success", "meassage":"search result","result":cart})
        }else{
            return res.json({"status":"failed", "message":"error found"})
        }

    }catch(err){
        return res.status(404).json({"status":"failed", "message":err.meassage})
    }
})




router.post('/addCart', async(req, res)=>{
    try{
        const {watchuuid,quantity,price}= req.body
        const useruuid = req.query.useruuid
        const addcart = new Cart(req.body);
        let cart = await Cart.findOne({useruuid:useruuid}).exec();
    if(cart){
        let data = cart.product
        console.log(data);
        let item = data.findIndex(index=>index.watchuuid==watchuuid)


       if(item>-1){
           let newItem = cart.product[item];
           newItem.quantity = quantity;
           cart.product[item] = newItem;

           newItem.price = price * newItem.quantity;
       }else{
        cart.product.push({watchuuid,quantity,price});
    }
    cart = await cart.save();
    res.json({"status":"success", "message":"product added", "result":cart})

    }else{
        let newcart = await Cart.create({useruuid,product:[{watchuuid,quantity,price}]})
        res.json({"status":"failed", "messsage":"Not found", "result":newcart})
    }
       
    }catch(error){
        return res.status(404).json({"status":"failed", "message":error.message})
    }
})

// router.get('/getCart', async(req, res)=>{
//     try{
//        const uuid = req.query.uuid
//        let order = await Cart.findOne({uuid:uuid})
//        if(order){
//            let data = order.product.length
//            let total = order.product
//            //console.log(total[0].price);
//            let Total =0;
//            for(let i=0;i<data;i++){
//             Total += total[i].price
//            }
//            //console.log("total" ,Total)

//            const cartData = await Cart.findOneAndUpdate({uuid:uuid},{Total:Total},{new:true}).exec()
//            if(cartData){
//                res.json({"status":"success", "result":cartData})
//            }
//        }else{
//            res.json({"status":"failed", "message":"Not found"})
//        }
//    }catch(err){
//        return res.status(404).json({"status":"failed", "message":err.message})
//    }
// })




router.delete('/deleteCart', async(req, res)=>{
    try{
        await Cart.findOneAndDelete({uuid:req.query.uuid}).exec()
        return res.json({"status":"success", "message":"deleted..."})

    }catch(err){
        return res.status(4040).json({"status":"failed", "message":err.meassage})
    }
})

module.exports = router;