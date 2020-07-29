const mongo = require('mongoose')

const BlogSchema = new mongo.Schema({
    title:{
        type:String,
        required:true,
        trim:true//trim white space
    },
    content:{
        type:String,
        required:true
    },
    status:{//public/private
        type:String,
        default:'public',
        enum:['public','private']
    },
    user:{//user connect to each story
        type:mongo.Schema.Types.ObjectId,
        ref:'User'
    }, 
    createdAt:{
        type:Date,
        default:Date.now
    }

})

//connect to mongo
module.exports=mongo.model('blog',BlogSchema);