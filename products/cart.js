const mongoose = require("mongoose");
const crypto = require("crypto");

const cart = new mongoose.Schema({
    uuid:{type:String, require:false},
    useruuid:{type:String, require:true},
    product:[{watchuuid: String, quantity:Number, price:Number}],
    address:{type:String , require:false},
    Total:{type:Number, require:false}
    
},
{
  timestamps:true
})

cart.pre('save', function(next){
    this.uuid ='CART'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    console.log(this.uuid);
    next();
})

module.exports = mongoose.model('CART', cart);













// const mongoose = require('mongoose');
// const Cart = new mongoose.Schema({
//     useruuid:{type:String, require:true},
//     products:[{uuid:{type:String}, quantity:{type:Number, default:1}}],
//     },
//      {
    
//         timestamps: true
// })

// module.exports = mongoose.model('CART', Cart);