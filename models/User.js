const mongo = require('mongoose')

const UserSchema = new mongo.Schema({
    googleId:{
        type:String,
        required:true
    },
    displayName:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    }, 
    image:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports=mongo.model('User',UserSchema);