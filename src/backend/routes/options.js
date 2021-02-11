const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

router.post('/api/options/upTable',async (req,res)=>{
  let status= false;
  let mess= "";
  try {
    if(req.body != null){
      await Row.insertMany(req.body);
      status = true;
    }
  } catch (err) { mess= err.toString(); status= false; };
  res.json({ status , mess });
});

router.get('/api/options/downallTable',async (req,res)=>{
  let status= false;
  let items = [];
  try {
    const allprods = await Row.find();
    for( const key in allprods )
      items.push((allprods[key]).toJSON());

    for( const key in items ){
      delete items[key]['_id'];
      delete items[key]['__v'];
    }
    status = true;
  } catch (err) {console.log( err ); status= false; };
  res.json({ status, items });
});

module.exports = router;

//const exjson = require('convert-excel-to-json');
//const jsonex = require('json2xls');
//const path = require('path');
//const fse = require('fs-extra');
//const moment = require('moment');

//const tmppath = path.join(__dirname,"../../frontend/img/tmp/");

/*function objtoarr(myjson) {                       //Function convert object in 2 arrays, first array with keys and second array with data 
  let oid = [];                                   //Create empty array
  let ocont = [];

  if(myjson instanceof Object){                   //Check if variable is ok
    oid = Object.keys(myjson);                    //Extract all keys and fill in array
    ocont = [];
    for(let i in myjson) 
      ocont.push(myjson[i]);                      //Extract all data and fill in array
  }
  return {oid, ocont};                            //Return both arrays
}*/

/*router.get('/views/options',async (req,res)=>{
  if(req.session.hasOwnProperty('passport')){
    if(req.isAuthenticated() && req.session.passport.user.level > 2 )
      res.sendFile(path.join(__dirname, '../views/options.html'));
    else
      res.redirect('/unauth.html');
  }else
    res.redirect('/unauth.html');
});*/

/*router.post('/api/options/edit',async (req,res)=>{
  let status= false;
  try {
    if(req.body){
      let { pos, cont } = req.body;
      if( (pos == 4) || (pos == 8) || (pos == 10) )
        cont = cont.sort();

      const date = moment().format();
      await Type.findOneAndUpdate({ pos }, { cont, date });
    }
    status = true;
  } catch (err36) {console.log(err36); status= false; };
  res.json({ status });
});*/

/*router.post('/api/options/datap',async (req,res)=>{
  let status= false;
  let items = [];
  try {
    if(req.files.length == 1){
      const afile = req.files[0];
      if((afile['mimetype'] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")||(afile['mimetype'] == "application/vnd.ms-excel")){
        const conv = objtoarr( exjson( {sourceFile: afile['path']} ) );
        items = conv['ocont'][0];
        status = true;
      }
      if(status && fse.existsSync( afile['path'] ) )
        fse.unlinkSync( afile['path'] );
    }
  } catch (err36) {console.log(err36); status= false; };
  res.json({ status, items });
});*/