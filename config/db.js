const mongoose = require('mongoose');

//connecting to MongoDB database
//use URI from config/config.env
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log('connected to mongoDB',conn.connection.host);

    }catch(error)
    {
        console.error(error);
        process.exit(666);
    }
}

module.exports=connectDB;