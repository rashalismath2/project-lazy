
const express=require('express');
const router=express.Router();

//code start declaring controller
const helloworld=require('../controllers/helloworld');

//code end declaring controller

//code start declaring routes
router.get('//user/{1}',helloworld.getHellowWorld);


//code end declaring routes

module.exports=router;