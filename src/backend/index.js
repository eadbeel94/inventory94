const express= require('express');      

const session= require('express-session');             //Solicito el session para manejar sesiones
const flash= require('connect-flash');                 //Solicito a connect flash para compartir dato entre formularios/URL
const passport= require('passport');                   //Solicito a passport de manera completa
const cors= require('cors');
const path= require('path');
//------------------------------------- Inicialize -------------------------------------//                     
require('./config/database.js');  
require('./config/passport.js');                                      //Inicialize connection database

//const MongoDBStore = require('connect-mongodb-session')(session);
//const store = new MongoDBStore({ uri: 'mongodb://localhost:27017/inventory', collection: 'sessions', expires: 1000 * 60 * 50 });
const app = express();   
app.set('port',process.env.PORT || 3300);  
//------------------------------------- Middleware -------------------------------------//         
app.use(express.json());    
app.use(express.urlencoded({extended: false}));
app.use(cors());
app.use(session({                                     //Inicializo el modulo sessions para poder guardar datos entre secicones
  secret: 'secret',                                   //Con esto compartimos datos entre /about con /edit y /notes etc etc
  resave: true,                                       //Previo a compartir datos con flash necesito crear seciones express para
  saveUninitialized: true,                             //cada ruta
  cookie: { secure: false, maxAge: 1000 * 60 * 2 }
  //store: store,
}));
app.use(passport.initialize());                       //Inicializo a passport
app.use(passport.session());                          //le indico a passport que utilizare seciones
app.use(flash());                                     //A travez de este middleware puedo usar variables globales y compartirlas 

//------------------------------------- Call routes -------------------------------------//
app.use('/', require('./routes/article.js'));
app.use('/', require('./routes/login.js'));
app.use('/', require('./routes/table.js'));
app.use('/', require('./routes/options.js'));
//------------------------------------- Static files -------------------------------------//
app.use(express.static(path.join(__dirname, '../public/')));   
//------------------------------------- Error manage -------------------------------------//
app.use(function(req, res, next) {                              //If user access to route not declare, this is redirect with error message
  /*process.env.NODE_ENV === 'production' ? 
  ( res.status(404).sendFile( path.join(__dirname, '../public/404.html')) ) : 
  ( res.status(404).redirect('http://localhost:8080/404.html') );*/
  res.status(404).sendFile( path.join(__dirname, '../public/404.html')) 
});
//------------------------------------- Start server -------------------------------------//
app.listen(app.get('port'), () => {                  
  console.log(`Server on port ${app.get('port')}`);    
});