const mongoose = require("mongoose");
const crypto = require('crypto');

const categorySchema = new mongoose.Schema({
    uuid:{type: String, required: false},
    categoryName:{type:String, require:true},
    ageRestriction:{type:String,enum:["15-20yr", "20yr", "above20"] ,require:false},
    image:{type:String, require:true},
    useruuid:{type:String, require:true}
},
{
    timestamps: true
});

// UUID generation
categorySchema.pre('save', function(next){
    this.uuid = 'CATEGORY'+crypto.pseudoRandomBytes(6).toString('hex').toUpperCase()
    console.log(this.uuid);
    next();
});

module.exports=mongoose.model('category',categorySchema, 'category');