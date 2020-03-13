const express=require('express');
const router=express.Router();
const projectController=require("../controllers/ProjectController");


router.post("/init",projectController.init);




module.exports=router;