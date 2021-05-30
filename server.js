const express=require("express");
const app=express();
const path=require("path");
// const ejs=require("ejs");
//Template Engine

app.set("views",path.join(__dirname,"/views"));
app.use("/files/download",require("./routes/download.js"));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.json());
const connectDB=require("./config/db.js");
connectDB();
const port=process.env.PORT||3000;




app.use("/api/files",require('./routes/files'));

app.use("/files",require('./routes/show'));

app.listen(port,()=>{
    console.log(`Listening on port ${port}`);
})