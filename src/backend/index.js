const express= require('express');                    //Call express library

const session= require('express-session');            //Use express-session feartures
const flash= require('connect-flash');                //For get a variable between routes and after erase it
const passport= require('passport');                  //Use passport local authentification methods
const cors= require('cors');                          //Send HTTP request between diferents servers
const path= require('path');                          //Manage route methods

//------------------------------------- Inicialize -------------------------------------//        
process.env.NODE_ENV !== 'production' && require('dotenv').config();    //Call .env just when development mode
require('./config/database.js');                      //Inicialize connection database
require('./config/passport.js');                      //Inicialize passport local configuration

const app = express();                                //Instance express in app object
app.set('port',process.env.PORT || 3300);             //Get port number and dave in 'port' tag

//------------------------------------- Middleware -------------------------------------//         
app.use(express.json());                              //For use ?Json 
app.use(express.urlencoded({extended: false}));       //For use GET/POST/PUT/DELETE
app.use(cors());                                      //Inicialize cors
app.use(session({                                     //Inicialize session
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 2 }    //Keep session value for 2 minutes
}));
app.use(passport.initialize());                       //Inicialize passport
app.use(passport.session());                          //Inicialize session
app.use(flash());                                     //Inicialize flash

//------------------------------------- Call routes -------------------------------------//
app.use('/api/article', require('./routes/article.js'));  //Call articles rest-api methods
app.use('/', require('./routes/login.js'));               //Call login rest-api methods
app.use('/api/table', require('./routes/table.js'));      //Call table rest-api methods
app.use('/api/options', require('./routes/options.js'));  //Call options rest-api methods

//------------------------------------- Static files -------------------------------------//
app.use(express.static(path.join(__dirname, '../public/')));   //Show all files into public folder

//------------------------------------- Error manage -------------------------------------//
app.use(function(req, res, next) {                             //If user access to route not declare, this is redirect with error message
  res.status(404).sendFile( path.join(__dirname, '../public/404.html')) 
});

//------------------------------------- Start server -------------------------------------//
app.listen(app.get('port'), () => {                  
  console.log(`Server on port ${app.get('port')}`);    
});