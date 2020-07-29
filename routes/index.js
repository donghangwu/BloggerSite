const express =require('express');
const path = require('path');

//bring stroySchema from mongoDB
const Blog = require('../models/blogSchema')

//protect rotes
const checkAuth = require('./proectRoutes').checkAuth;
const alreadyAuthed = require('./proectRoutes').alreadyAuth;

//create a route
const router = express.Router();

//description: login/landing page
//route Get /
//2nd arugment is to check auth, if someone alread login redirect to dahsboard
router.get('/',alreadyAuthed,(req,res)=>{
    res.render('login',{layout:'loginTemplate'});
   
})


//description: login/dashboard
//rote: get /dashboard
//2nd arg to check if someone did not login and try to go dashboard
router.get('/dashboard',checkAuth,async (req,res)=>{
    try {
        //fetch story from mongoDB
        //.lean() allow to passin and use it in handlebar template
        const blogs = await Blog.find({user:req.user.id}).lean();
        res.render('dashboard',{layout:'main',name:req.user.firstName,blogs:blogs});
        
    } catch (error) {
        console.error(error);
        res.render('../views/errorTemplate/404');

    }
})

module.exports=router;