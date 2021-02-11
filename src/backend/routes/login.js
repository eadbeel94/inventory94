const router = require("express").Router();                         //Call dependencies needed
const passport = require('passport');                     //Mando llamar a passport completo
const bcrypt = require('bcrypt');
const m = require('dayjs');
const { User } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

//const prod= process.env.NODE_ENV === 'production';

router.get('/api/auth/getPassport',async (req,res)=>{
  let status = false;
  let item= []
  try {
    if(req.session.hasOwnProperty('passport')){
      item= req.session.passport.user;  
      status= true;
    }
  } catch (err) {console.log(err); status = false; };
  res.json({ status, item });
});

router.post("/api/auth/", passport.authenticate("local", {             //Si el usuario pre
  successRedirect: `/pages/main/`,
  failureRedirect: `/`,
  failureFlash: true
}));

router.get('/api/auth/allUsers',async (req,res)=>{
  let status= false;
  let items = [];
  try {
    //if(req.session.hasOwnProperty('passport')){
    //  if(req.session.passport.user.level >= 2 ){
        items = await User.find({}," name , fullname , phone , level , depts , date ", { skip: 2 });
        status = true;
    //  }
    //}
  } catch (err) {console.log(err); status= false; };
  res.json({ status, items });
});

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
  } catch (err) {console.log(err); status= false; message= "Error from server"; };
  res.json({ status, message });
});

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
  } catch (err) {console.log(err); status= false; };
  res.json({ status, item });
});

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


  } catch (err) {console.log(err); status= false; message= "Error from server"; };
  res.json({ status, message });
});

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
  } catch (err126) {console.log(err126); status= false; message= "Error from server"; };
  res.json({ status, message });
});

router.get("/api/auth/logout", (req, res) => {
  req.logout();                                                     //Utilizo el motodo de passport para deslogear
  res.redirect("/");                                          //Se redirecciona la pagina a sign in
});

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

router.get('/api/auth/status',async (req,res)=>{
  let status= false;
  let message= {};
  try {
    const anerror= req.flash('error');
    if( Array.isArray(anerror) ){
      message= anerror[ anerror.length - 1 ];
      status= message != undefined; 
    }
  } catch (err) { console.log(err); status= false; };
  res.json({ status, message });
});

module.exports = router;

//const path = require('path');

/*router.get('/api/auth/deps',async (req,res)=>{
  let status= false;
  let items = [];
  try {
    items = await Type.findOne({desc: "alldepts"}," cont ");
    status = true;
  } catch (err36) {console.log(err36); status= false; };
  res.json({ status, items: items['cont'] });
});*/

/*router.get('/api/auth/userbyacc',async (req,res)=>{
  let status= false;
  let item = [];
  try {
    if(req.query.name){
      const name = String(req.query.name).toLowerCase();
      item = await User.findOne({name}, " fullname ");
      status = true;
    }
  } catch (err83) {console.log(err83); status= false; };
  res.json({ status, item });
});*/

/*router.get('/pages/redirect',async (req,res)=>{
  const prev = (String(req.headers.referer)).replace((`http://${String(req.headers.host)}/views/`),"");
  if(req.isAuthenticated()){
    if( (prev.indexOf('tableRO') == 0) || (prev.indexOf('tableRW') == 0) || (prev.indexOf('articleNW') == 0) || (prev.indexOf('users') == 0) || (prev.indexOf('options') == 0) )
      res.redirect('/main.html');
    else if(prev.indexOf('articleRO') == 0)
      res.redirect('/views/tableRO');
    else if(prev.indexOf('articleRW') == 0)
      res.redirect('/views/tableRW');
    else
      res.redirect('/');
  }else
    res.redirect('/');
});*/