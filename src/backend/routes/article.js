/** @namespace Backend/route/article */

const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client
/**
 * Get all keys from DB collection
 *
 * @name allfields
 * @path {GET} /api/article/allfields
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/article
 */
router.get('/allfields', async (req,res)=>{
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
/**
 * Get article using vin value
 *
 * @name find
 * @path {GET} /api/article/find
 * @query {String} [vin] get vin value from client interface
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/article
 */
router.get('/find',async (req,res)=>{
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
/**
 * Add article in database
 *
 * @name add
 * @path {POST} /api/article/add
 * @body {Object} Include all car's fileds for after saved into database
 * @response {boolean} status if element storage successfully
 * @memberof Backend/route/article
 */
router.post('/add',async (req,res)=>{
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
/**
 * Edit article in database
 *
 * @name edit
 * @path {POST} /api/article/edit
 * @body {Object} Include all car's fileds for after editer into database
 * @response {boolean} status if element edited successfully
 * @memberof Backend/route/article
 */
router.post('/edit',async (req,res)=>{
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
/**
 * Delete an article in database
 *
 * @name delete
 * @path {DELETE} /api/article/delete
 * @query {String} [vin] get vin value from client interface
 * @response {boolean} status if element delete successfully
 * @memberof Backend/route/article
 */
router.delete('/delete',async (req,res)=>{
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