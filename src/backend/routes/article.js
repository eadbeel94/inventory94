const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

//---------------------------------- READ ARTICLE ----------------------------------//

router.get('/api/article/allfields', async (req,res)=>{
  let status= false;
  let items= [];
  try {
    const query= await Row.schema.obj;
    for (const key in query) 
      items.push(key)
    
    status= true;
  } catch (err) { console.log(err); status= false; };
  res.json({ status, items });
});

router.get('/api/article/find',async (req,res)=>{
  let status = false;
  let item = [];
  try {
    if(req.query.vin){
      item = await ( await Row.findOne({ 'vin' : `${req.query.vin}` }) ).toJSON();
      delete item['__v'];
      status= true;
    };
  } catch (err) {console.log(err); status= false; };
  res.json({ status, item });
});

//---------------------------------- ADD ARTICLE ----------------------------------//

router.post('/api/article/add',async (req,res)=>{
  let status= false;
  try {
    if( req.session.hasOwnProperty('passport') ){
      if( req.session.passport.user.level >= 2 && req.body != null  ){  
        const newArticle= new Row(req.body);
        await newArticle.save();
        status = true;
      };
    };
  } catch (err) {console.log(err); status= false; };
  res.json({ status });
});

//---------------------------------- EDIT ARTICLE ----------------------------------//

router.post('/api/article/edit',async (req,res)=>{
  let status= false;
  try {
    if( req.session.hasOwnProperty('passport') ){
      if(req.session.passport.user.level >= 2 && req.body != null){
        const article= {};
        for (let iprop in req.body)
          article[`${iprop}`] = req.body[`${iprop}`]
        
        const vin= article['vin'];
        delete article['vin'];
        
        await Row.findOneAndUpdate( { vin }, article );
        status= true;
      };
    };
  } catch (err) {console.log(err); status= false; };
  res.json({ status });
});

//---------------------------------- DELETE ARTICLE ----------------------------------//
router.delete('/api/article/delete',async (req,res)=>{
  let status= false;
  try {
    if( req.session.hasOwnProperty('passport') ){
      if( req.session.passport.user.level >= 2 && req.query.vin ){
        await Row.findOneAndDelete({vin: req.query.vin})
        status = true;
      };
    };
  } catch (err) {console.log(err); status= false; };
  res.json({ status });
});

module.exports = router;