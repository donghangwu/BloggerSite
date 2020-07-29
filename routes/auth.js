const express =require('express');
const path = require('path');
const passport = require('passport');
//create a route
const router = express.Router();

//descrption: Auth with google auth
//route: Get /auth/google
router.get('/google',passport.authenticate('google',{scope:['profile']}))


//descrption: google auth redirect
//route: get /auth/google/redirect

router.get('/google/redirect',passport.authenticate('google',
{failureRedirect:'/'}),//if fails redirect to login page
(req,res)=>{//if success go to user dashboard
    res.redirect('/dashboard')
}
)

//descrption: logout user
//route: /auth/logout
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/');
})



module.exports=router;