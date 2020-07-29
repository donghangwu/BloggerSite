const express =require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const exphbs = require('express-handlebars')
const methodOverride= require('method-override')
const connectDB = require('./config/db')
//Load config
dotenv.config({path:'./config/config.env'});
//passport config
require('./config/passport')(passport);

//connect to mongo database
connectDB();
//init my app
const app = express();
//parse informations
app.use(express.urlencoded({extended:false}));

if(process.env.NODE_ENV==='development')
{
    app.use(morgan('dev'));
}
//method override from https://www.npmjs.com/package/method-override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
}))

const formatDate = require('./views/hbsHelper').formatDate;
const preView = require('./views/hbsHelper').preView;
const removeHTML = require('./views/hbsHelper').removeHTML;
const checkEdit = require('./views/hbsHelper').checkEdit;


//express-handlebar
app.engine('.hbs', exphbs({
    //helper function in hbs
    helpers: {formatDate,preView,removeHTML,checkEdit},
    defaultLayout:'main',//set the default header/footer that will be share for every page
    extname: '.hbs'}));
app.set('view engine', '.hbs');

//must be above passport middleware
//session middleware
app.use(session({
    secret:'key',
    resave:false,
    saveUninitialized:false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//express global var
//acess to current login user globally
app.use((req,res,next)=>{
    res.locals.user=req.user||null;
    next();
})

// static folder set up the css style
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'views')))

//static folder for images
app.use(express.static(path.join(__dirname,'views','images'))); 


//link routing files with '/'
//routes: / && /dashboard
const indexRoute = require('./routes/index')
app.use('/',indexRoute);

//routes: /auth/google && /auth/google/redirect &&/auth/logout
const authRoute = require('./routes/auth');
app.use('/auth',authRoute);

//routes: /stories/add && 
const blogRoute= require('./routes/blogs');
app.use('/blogs',blogRoute)



//any route that didn't implemented will be 404
app.use((req,res)=>{
    res.render('errorTemplate/404')
})

// app.get('/', function (req, res) {
//     res.render('home');
// });





//when deploy heroku will listen process.env.PORT
const PORT= process.env.PORT || 3000;


app.listen(PORT,console.log('running server in',process.env.NODE_ENV,'on port',PORT));
