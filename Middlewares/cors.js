
module.exports.cors=function(app){

    app.use((req,res,next)=>{

        res.header("Access-Control-Allow-Origin","*");
        res.header(
            "Access-Control-Allow-Headers","Origin,X-Requeste-Withd,Content-Type,Accept,Authorization");

        if(req.method==="OPTIONS"){
            res.header("Access-Control-Allow-Methods","PUT,POST,GET,PATCH,DELETE");
            return res.status(200).json({});
        }

        next();
    });

}