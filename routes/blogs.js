const express =require('express');
const path = require('path');
const blogSchema = require('../models/blogSchema');

//bring stroySchema from mongoDB

//protect rotes
const checkAuth = require('./proectRoutes').checkAuth;

//create a route
const router = express.Router();

//description: render add blog page
//route:       Get /blogs/add
//2nd arugment is to check auth, if someone alread login redirect to dahsboard
router.get('/add',checkAuth,(req,res)=>{
    res.render('blogTemplate/addBlog',{layout:'main'});
   
})

//description: display public blogs
//route:       Get /blogs
//2nd arugment is to check auth, if someone alread login redirect to dahsboard
router.get('/',checkAuth,async (req,res)=>{
    try {
        //.lean is for pass it to hbs template
        const blogs = await blogSchema.find({status:'public'})
        .populate('user')
        .lean();
        //render hbs template and pass blogs into hbs template
        res.render('blogTemplate/publicBlogs',{Blogs:blogs});
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
   
})


//description: render edit blog page
//route:       Get /blogs/edit/:id
//need to add async and await to use the mongoDB functions
router.get('/edit/:id',checkAuth,async (req,res)=>{
   var blog = await blogSchema.findOne({_id:req.params.id}).lean();

    console.log(blog);
    if(!blog)
    {
        res.render('/errorTemplate/404');
    }
    //passin blog to edit hbs template
    res.render('blogTemplate/edit',{blog:blog});


})



//description: taking care the add blog form
//route:       POST /blogs  FROM addBlog.hbs
//need to add async and await to use the mongoDB functions
router.post('/',checkAuth,async(req,res)=>{
    console.log(req.body);
    try {
        req.body.user=req.user.id;
        await blogSchema.create(req.body);
        res.redirect('/dashboard');
        
    } catch (error) {
        console.error(error);
        res.render('errorTemplate/404')
    }
   
})


//description: edit blog
//route:       POST /blogs/:id  FROM editBlog.hbs
//need to add async and await to use the mongoDB functions
router.put('/:id',checkAuth,async(req,res)=>{
  var blog = await blogSchema.findById(req.params.id).lean();
  if(!blog)
  {
      return res.render('errorTemplate/404');
  }
   blog=await blogSchema.findByIdAndUpdate({_id:req.params.id},req.body,{
       runValidators:true
   });
  res.redirect('/dashboard');

   
})


module.exports=router;