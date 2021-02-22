/** @namespace Backend/route/login */

const router = require("express").Router();                         //Call dependencies needed
const passport = require('passport');                     //Mando llamar a passport completo
const bcrypt = require('bcrypt');
const m = require('dayjs');
const { User } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

/**
 * Get user logged credential values
 *
 * @name getPassport
 * @path {GET} /api/auth/getPassport
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/login
 */
router.get('/api/auth/getPassport',async (req,res)=>{
  let status = false;
  let item= []
  try {
    if(req.session.hasOwnProperty('passport')){
      item= req.session.passport.user;  
      status= true;
    }
  } catch (err) { console.log(err); status = false; };
  res.json({ status, item });
});
/**
 * Passport authentification
 *
 * @name auth
 * @path {POST} /api/auth
 * @auth This route requires Authentication. If authentication fails it redirect main page with error message
 * @memberof Backend/route/login
 */
router.post("/api/auth", passport.authenticate("local", {             //Si el usuario pre
  successRedirect: `/pages/main/`,
  failureRedirect: `/`,
  failureFlash: true
}));
/**
 * Get all users into user collection
 *
 * @name allUsers
 * @path {GET} /api/auth/allUsers
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/login
 */
router.get('/api/auth/allUsers',async (req,res)=>{
  let status= false;
  let items = [];
  try {
    if(req.session.hasOwnProperty('passport')){
      if(req.session.passport.user.level >= 2 ){
        items = await User.find({}," name , fullname , phone , level , depts , date ", { skip: 2 });
        status = true;
      }
    }
  } catch (err) { console.log(err); status= false; };
  res.json({ status, items });
});
/**
 * Add user into DB user collection
 *
 * @name addUser
 * @path {POST} /api/auth/addUser
 * @body {Object} Include all user's fileds for after saved into database
 * @response {boolean} status if query database complety successfully
 * @response {string} message show a text with information result
 * @memberof Backend/route/login
 */
router.post('/api/auth/addUser',async (req,res)=>{
  let status= false;
  let message = "";
  try {
    if(req.session.hasOwnProperty('passport')){
      if( req.session.passport.user.level >= 2 && req.body ){
        const { name, fullname, phone, pass, confirm, level, depts } = req.body;
        if( pass == confirm ){
          const salt = await bcrypt.genSalt(10);  
          const password = await bcrypt.hash(pass, salt);
          const date = m().format();
          const newUser = new User({ name, fullname, phone, password, level, depts, date }); 
          await newUser.save();
          status = true;
          message= "User "+ name.toUpperCase() + " saved successfully" ;
        }else{
          status = false; 
          message= "Password doesn't match";
        }
      };
    };
  } catch (err) { console.log(err); status= false; message= "Error from server"; };
  res.json({ status, message });
});
/**
 * Get just a user from DB
 *
 * @name getanUser
 * @path {GET} /api/auth/getanUser
 * @query {String} [id] get id value from client interface
 * @response {boolean} status if query database complety successfully
 * @response {Object} item getting from database query result
 * @memberof Backend/route/login
 */
router.get('/api/auth/getanUser',async (req,res)=>{
  let status= false;
  let item = [];
  try {
    if(req.session.hasOwnProperty('passport')){
      if( req.session.passport.user.level >= 2 && req.query.id ){
        const id = req.query.id;
        item = await User.findById(id, " name , fullname , phone , level , depts , date ");
        status = true;
      };
    };
  } catch (err) { console.log(err); status= false; };
  res.json({ status, item });
});
/**
 * Overwrite user information using you id
 *
 * @name editanUser
 * @path {POST} /api/auth/editanUser
 * @body {Object} Include all user's fileds for after edited into database
 * @response {boolean} status if query database complety successfully
 * @response {string} message show a text with information result
 * @memberof Backend/route/login
 */
router.post('/api/auth/editanUser',async (req,res)=>{
  let status= false;
  let message= "";
  try {
    if(req.session.hasOwnProperty('passport')){
      if(req.session.passport.user.level >= 2 && req.body){
        const eUser = req.body;
        status= eUser.hasOwnProperty('id') && eUser.hasOwnProperty('name');
        if( eUser.hasOwnProperty('pass') ){
          status= eUser.pass == eUser.confirm;
          message= "Password doesn't match";
        }
        if( status ){
          if( eUser.hasOwnProperty('pass') ){
            if( eUser.pass == eUser.confirm ){
              const salt= await bcrypt.genSalt(10);  
              eUser.password= await bcrypt.hash(eUser.pass, salt);
              delete eUser.pass;
              delete eUser.confirm;
            }
          }
          const id= eUser.id;
          delete eUser.id;
          await User.findByIdAndUpdate( id, eUser );
          status = true;
          message= `${eUser.name.toUpperCase()}'s data ${ eUser.hasOwnProperty('password') ? " and password" : "" } modified successfully`;
        }
      }
    }
  } catch (err) { console.log(err); status= false; message= "Error from server"; };
  res.json({ status, message });
});
/**
 * Delete user into DB user collection
 *
 * @name delanUser
 * @path {DELETE} /api/auth/delanUser
 * @query {String} [id] get id value from client interface
 * @response {boolean} status if query database complety successfully
 * @response {string} message show a text with information result
 * @memberof Backend/route/login
 */
router.delete('/api/auth/delanUser',async (req,res)=>{
  let status= false;
  let message= "";
  try {
    if(req.session.hasOwnProperty('passport')){
      if(req.session.passport.user.level >= 2 && req.query.id){
        const id = req.query.id;
        await User.findByIdAndRemove(id);
        status = true;
        message= "User has been delete successfully";
      };
    };
  } catch (err) { console.log(err); status= false; message= "Error from server"; };
  res.json({ status, message });
});
/**
 * Loggout user using passport method and redirect main page
 *
 * @name logout
 * @path {GET} /api/auth/logout
 * @memberof Backend/route/login
 */
router.get("/api/auth/logout", (req, res) => {
  req.logout();                                                     //Utilizo el motodo de passport para deslogear
  res.redirect("/");                                          //Se redirecciona la pagina a sign in
});
/**
 * Manage redirect method depend from any page
 *
 * @name redirect
 * @path {GET} /pages/redirect
 * @memberof Backend/route/login
 */
router.get('/pages/redirect',async (req,res)=>{
  const prev= req.headers.referer.substr( req.headers.referer.indexOf('/pages/') + 6 );
  if(req.isAuthenticated()){
    if( prev.indexOf('/table') >= 0 || prev.indexOf('/article') >= 0 || prev.indexOf('/options') >= 0 || prev.indexOf('/users') >= 0 )
      res.redirect('/pages/main'); 
    else if( req.headers.referer.indexOf('/main') >= 0 )
      res.redirect('/');
    else
      res.redirect('/');
  }else
    res.redirect('/');
});
/**
 * Show client status loggin
 *
 * @name status
 * @path {GET} /api/auth/status
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/login
 */
router.get('/api/auth/status',async (req,res)=>{
  let once= false;
  req.session.views ? ( req.session.views++ ) : ( req.session.views = 1 , once= true , req.session.save() );

  let status= false;
  let message= {};
  try {
    const anerror= req.flash('error');
    if( Array.isArray(anerror) ){
      message= anerror[ anerror.length - 1 ];
      status= message != undefined; 
    }
  } catch (err) { console.log(err); status= false; };
  res.json({ status, message , once });
});

module.exports = router;