const express = require('express');
const crypto = require('crypto');
const { default: mongoose } = require('mongoose');

const user =new mongoose.Schema({
    uuid:{type:String, require:true},
    Name:{type:String, require:true},
    email:{type:String, require:true},
    mobileNumber:{type:String, require:true},
    setPassword:{type:String, require:true},
    role:{type: String, enum:['admin', 'user'], required: false, default: 'user'},
   // address:{type:String, require:true},
    verifyOtp:{type:String, require:false},
    // active:{type:Boolean, require:false, default:false},
 // verifiedUser:{type:Boolean, require:false, default:false},
    lastVisted:{type:String, require:false},
    loginStatus:{type:Boolean, require:false ,default:false}
},{
    timestamps:true
});

user.pre('save', function(next){
    this.uuid ="user"+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    next()
});
module.exports= mongoose.model('user',user,'user');