const mongoose=require('mongoose')

const schema=mongoose.Schema;

const userSchema=new schema({
    userName:{type:String },
    email:{type:String,unique:true},
    password:{type:String,require:true},
    mobile:{type:String,require:true},
    gender:{type:String,require:true},
    createdAt:{type:Number,default:Date.now().valueOf()},
    updatedAt:{type:Number,default:Date.now().valueOf()},
    image:{type:String},
    status:{type:Boolean}


})
module.exports=mongoose.model('User',userSchema)