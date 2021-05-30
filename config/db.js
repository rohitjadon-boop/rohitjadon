const mongoose=require("mongoose");
require("dotenv").config();

function connectDB(){
    mongoose.connect(process.env.MONGO_CONNECTION_URL,{useUnifiedTopology:true,useCreateIndex:true,useNewUrlParser: true,useFindAndModify:true});
        const connection=mongoose.connection;

        connection.once("open",()=>{
            console.log("DataBase Connected");
        }).catch((err)=>{
            console.log(err+"Connection Failed");
        })
}

module.exports=connectDB;
