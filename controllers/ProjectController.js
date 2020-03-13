
const sequelize = require("../db/db_connection").sequelize;
var copydir = require('copy-dir');
var fs=require("fs");
var path = require('path');
var rimraf = require("rimraf");


module.exports.init = function(req, res) {

        //1)Copy meta project into temporarymetafolder
        
        //create a name for new folder
        var targetFolderName="userId"+Math.random().toString(36);
        //create a folder for the user
        var targetFolderPath = path.join(__dirname, '..', 'TemperoryMetaFolders',targetFolderName);
        //create the folder
        fs.mkdirSync(targetFolderPath);

        var metaFolderPath = path.join(__dirname, '..', 'MetaProject');
        //2)copy the meta files to temporry path
        var promise= 
             new Promise(function(resolve,reject){
                copydir(metaFolderPath,targetFolderPath, function(err){
                    if(err) {
                        reject("");
                        console.log(err)
                    }
                    else{
                        resolve("");
                        console.log('done');
                    }
                })
            })
     
            //3)after coppied create neccessary files, controllers, route files, and modify app.js
            promise.then(async a=>{
                var datas=req.body.data;
                for(data of datas){
                    //create controlllers
                    var controllerFileName=data.controllerName;
                    var createControllerIn=path.join(targetFolderPath,"controllers",controllerFileName+".js");
                    var controllerFileData="//code start writing controller body\n\n//code end writing controller body\n";
                    fs.writeFileSync(createControllerIn,controllerFileData)

                    //create route files
                    var baseUriFileName=data.baseUri;
                    var f=baseUriFileName[0];
                    var b=baseUriFileName.replace(f,f.toUpperCase());  
                    baseUriFileName=b;
                    var createRouteFileIn=path.join(targetFolderPath,"routes",baseUriFileName+".js");
                    var reouteFileData="const express=require('express');\nconst router=express.Router();\n\n//code start declaring controller\n\n//code end declaring controller\n\n//code start declaring routes\n\n//code end declaring routes\n\nmodule.exports=router;";
                    fs.writeFileSync(createRouteFileIn,reouteFileData)

                    //write start route declarations in ap.js
                    var apdotjsfile=path.join(targetFolderPath,"app.js");
                    var appdotjs=fs.readFileSync(apdotjsfile,"UTF-8");
                    var startIndex=appdotjs.indexOf("//code end route declarations");
                    var firstPartOfTheFile=appdotjs.substring(0,startIndex-1);
                    
                    var secondPartOfTheFile=appdotjs.substring(startIndex);
                    var createdFirstPart= firstPartOfTheFile+"\nconst route"+baseUriFileName+"=require('./routes/"+baseUriFileName+"');\n"
                    var  newappdotjs=createdFirstPart+secondPartOfTheFile
                    fs.writeFileSync(apdotjsfile,newappdotjs);


                    //write start route declarations in app.js
                    var apdotjsfile=path.join(targetFolderPath,"app.js");
                    var appdotjs=fs.readFileSync(apdotjsfile,"UTF-8");
                    var startIndex=appdotjs.indexOf("//code end route statements");
                    var firstPartOfTheFile=appdotjs.substring(0,startIndex-1);
                    var secondPartOfTheFile=appdotjs.substring(startIndex);
                    var createdFirstPart= firstPartOfTheFile+"\napp.use('/"+baseUriFileName+"',route"+baseUriFileName+");\n"
                    var  newappdotjs=createdFirstPart+secondPartOfTheFile
                    fs.writeFileSync(apdotjsfile,newappdotjs);


                    //write start declaring controller in created route file
                    var readRouterFile=fs.readFileSync(createRouteFileIn,"UTF-8");
                    var len="//code start declaring controller".length
                    var startIndex=readRouterFile.indexOf("//code start declaring controller");
                    var firstPartOfTheFile=readRouterFile.substring(0,startIndex+len);
                    var secondPartOfTheFile=readRouterFile.substring(startIndex+len);
                    var createdFirstPart= firstPartOfTheFile+"\nconst "+controllerFileName+"=require('../controllers/"+controllerFileName+"');"
                    var  newRouteFiledata=createdFirstPart+secondPartOfTheFile
                    fs.writeFileSync(createRouteFileIn,newRouteFiledata);


                    //write start declaring routes in created route file
                    var readRouterFile=fs.readFileSync(createRouteFileIn,"UTF-8");
                    var len="//code start declaring routes".length
                    var startIndex=readRouterFile.indexOf("//code start declaring routes");
                    var firstPartOfTheFile=readRouterFile.substring(0,startIndex+len+1);
                    var secondPartOfTheFile=readRouterFile.substring(startIndex+len);


                    var pr=new Promise(function(resolve,reject){
                        var i=0;
                        var createdFirstPart= "\n";
                        for(route of data.routes){
                            createdFirstPart=createdFirstPart+firstPartOfTheFile+"router."+route.method+"('/"+route.uri+"',"+controllerFileName+"."+route.functionName+");\n"
                            i++;
                        }
                        if(i=data.routes.length){
                            resolve(createdFirstPart)
                        }
                    })
                    var txt=await pr;

                    var  newRouteFiledata=txt+secondPartOfTheFile
                    fs.writeFileSync(createRouteFileIn,newRouteFiledata);

                    //write start writing controller body in controller file
                    var readControllerFile=fs.readFileSync(createControllerIn,"UTF-8");
                    var len="//code start writing controller body".length
                    var startIndex=readControllerFile.indexOf("//code start writing controller body");
                    var firstPartOfTheFile=readControllerFile.substring(0,startIndex+len+1);
                    var secondPartOfTheFile=readControllerFile.substring(startIndex+len);


                    var pr=new Promise(function(resolve,reject){
                        var i=0;
                        var createdFirstPart= "\n";
                        for(route of data.routes){
                            createdFirstPart=createdFirstPart+firstPartOfTheFile+"module.exports."+route.functionName+"= function(req, res) {\n\n};"
                            i++;
                        }
                        if(i=data.routes.length){
                            resolve(createdFirstPart)
                        }
                    })
                    var txt=await pr;

                    var  newControllerFileData=txt+secondPartOfTheFile
                    fs.writeFileSync(createControllerIn,newControllerFileData);



                }
            })

    // 3)delete temporary folder
        // rimraf.sync(targetFolderPath);
    
    return res.status(200).json({});
};

