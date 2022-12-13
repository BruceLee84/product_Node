const mongoose = require("mongoose");
const crypto = require("crypto");

const Order = new mongoose.Schema({
    uuid:{type:String, require:false},
    useruuid:{type:String, require:true},
    orderuuid:{type:String, require:true},
    // address:{type:Object, require:true},
    status:{type:String, default:false}
    
},
{
  timestamps:true
})

Order.pre('save', function(next){
    this.uuid ='ORDER'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase();
    console.log(this.uuid);
    next();
})

module.exports = mongoose.model('ORDER', Order);