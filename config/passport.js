const google = require('passport-google-oauth20').Strategy
const mongo = require('mongoose')
//Bring the user schema from model
const User = require('../models/User')

module.exports=function(passport){
    passport.use(new google({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/redirect'
    },
    async(accessToken,refreshTokeen,profile,callback)=>{
        const newuser = {
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image:profile.photos[0].value
            
        }

        try{
            //check if its a existing user at mongoDB
            let user = await User.findOne({googleId:profile.id});
            if(user)//if the user exist
            {
                callback(null,user)
            }
            else{//if user do not exist create new user at mongoDB
                user = await User.create(newuser);
                callback(null,user);
            }

        }
        catch(error)
        {
            console.log(error);
        }


        console.log(profile);

    }))

    //from passport.js googleOauth20 document
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });



}

