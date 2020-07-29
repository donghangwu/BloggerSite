function checkAuth(req,res,next)
{
    //if the user is login go to the next middleware
    if(req.isAuthenticated())//isAuthenticated() is from passport.js
    {
        return next();
    }
    else{
        res.redirect('/')
    }

}
function alreadyAuth(req,res,next)
{
    //if user already login go to dashboard
    if(req.isAuthenticated())
    {
        res.redirect('/dashboard')
    }
    else{
        return next();
    }
}

module.exports.checkAuth=checkAuth;
module.exports.alreadyAuth=alreadyAuth;