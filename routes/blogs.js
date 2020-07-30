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
//dont need to protect route for public blogs/ for guest vistors
router.get('/',async (req,res)=>{
    try {
        //.lean is for pass it to hbs template
        const blogs = await blogSchema.find({status:'public'})
        .populate('user')
        .lean();
        //render hbs template and pass blogs into hbs template
        res.render('blogTemplate/publicBlogs',{Blogs:blogs,scope:'public'});
    } catch (error) {
        console.log(error);
        res.render('error/404')
    }
   
})


//description: render single blog page
//route:       Get /blogs/:id
//dont need to protect route for single blogs/ for guest vistors
router.get('/:id', async(req,res)=>{
    try {
        //need .lean() to pass blog to hbs template
        var blog = await blogSchema.findById(req.params.id)
        .populate('user')
        .lean();
        
        res.render('blogTemplate/singleBlog',{blog:blog})
    } catch (error) {
        console.log(error);
    }
   
})


//description: render all blogs from the user
//route:       Get /blogs/user/:id
//dont need to protect route for blogs/ for guest vistors
router.get('/user/:id', async(req,res)=>{
    try {
        //need .lean() to pass blog to hbs template
        var blogs = await blogSchema.find({user:req.params.id,status:'public'}).populate('user').lean();
        //console.log(blogs);
        console.log(typeof blogs[0].user.firstName)
        res.render('blogTemplate/publicBlogs',{Blogs:blogs,scope:blogs[0].user.firstName})
    } catch (error) {
        console.log(error);
    }
   
})


//description: render edit blog page
//route:       Get /blogs/edit/:id
//need to protect routes only authed user can edited their blog
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
    await blogSchema.findByIdAndUpdate({_id:req.params.id},req.body);
   console.log('editing:',blog);
  res.redirect('/dashboard');

   
})



//description: delete blog
//route:       DELETE /blogs/:id
//2nd arugment is to check auth, if someone alread login redirect to dahsboard
router.delete('/:id',checkAuth, async(req,res)=>{
    try {
        
        await blogSchema.remove({_id:req.params.id});
        res.redirect('/dashboard');

    } catch (error) {
        console.log(error);
        
    }
   
})


module.exports=router;