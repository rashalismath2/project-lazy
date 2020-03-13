const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports=(req,res,next)=>{

    try{
        const token=req.query.api_token;
        const decode=jwt.verify(token,process.env.JWT_PASSWORD);
        req.userId=decode.id;
        req.email=decode.email;
        req.userFirstName=decode.first_name;
        req.userLastName=decode.last_name;
        next();
    }
    catch(error){
        return res.status(404).json({
            message:"authentication failed"
        });
    }

}