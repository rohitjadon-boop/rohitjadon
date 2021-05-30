const router=require("express").Router();
const multer=require("multer");
const path=require("path");
const File=require("../models/file.js");
const{v4:uuid4}=require("uuid");

let storage=multer.diskStorage({
    destination:(req,file,cb)=>cb(null,`uploads`),
    filename:(req,file,cb)=>{
        const filename=`${Date.now()}-${Math.round(Math.random()*1E9)}${path.extname(file.originalname)}`;

        cb(null,filename);
    }
});


let upload=multer({
    storage:storage,
    limit:{
        filesize:100*1024*1024}
}).single("myfile");




router.post("/",(req,res)=>{
    //Validate Request
    


    //Store File



    upload(req,res,async (err)=>{
        if(!req.file)
    {
        return res.json({error:"All Fields Are Required"});
    }
if(err)
{
    return res.status(500).send("Error");
}

 //Store In DataBase

 const file=new File({
    
   filename:req.file.filename,
   uuid:uuid4(),
   path:req.file.path,
   size:req.file.size
 });


 const response=await file.save();

return res.json({file:`${process.env.APP_BASE_URL}/files/${response.uuid}`});

    })


   


    //Response->Link

})


router.post("/send",async(req,res)=>{
  const{uuid,emailTo,emailFrom}=req.body;
  //Validate Request
  if(!uuid||!emailTo||!emailFrom)
  {
      return res.status(422).send({error:"All Fields Are Required"});
  }


  //Get Data From Database

  const file=await File.findOne({uuid:uuid});
   if(file.sender)
   {
    return res.status(422).send({error:"Email Already Sent"});
   }
   file.sender=emailFrom;
   file.receiver=emailTo;
   const response=await file.save();
    //Send Email


    const sendMail=require("../services/emailservices");

    sendMail({
        from:emailFrom,
        to:emailTo,
        subject:"InshareFile Sharing",
        text:`${emailFrom} shared a file with You`,
        html:require("../services/emailTemplate")({
            emailFrom:emailFrom,
            downloadLink:`${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size:parseInt(file.size/1000)+'KB',
            expires:'24 Hours'
        })
    });
  return res.send({success:true});
   
});

module.exports=router;