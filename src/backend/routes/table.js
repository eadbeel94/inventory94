/** @namespace Backend/route/table */

const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client
/**
 * Get 20 articles.
 *
 * @name row
 * @path {GET} /api/table/row
 * @query {String} [page] select group based an page number
 * @query {String} [ed] check if url include 'ro(read only)' value
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @response {number} count total count into database
 * @memberof Backend/route/table
 */
router.get('/row',async (req,res)=>{
  let status= false;
  let show= false;
  let items= [];
  let count= 0;
  try {
    if(req.query.ed && req.query.page > 0){
      show= req.query.ed == 'ro' ? true : (req.session.hasOwnProperty('passport') && (show= req.session.passport.user.level >= 2));
      if( show ){
        const skip= (Number(req.query.page) * 20) -20;
        items= await Row.find().skip(skip).limit(20);
        count= await Row.find().countDocuments(); 
        status = true;
      }
    }
  } catch (err) {console.log(err); status= false; };
  res.json({ status, items , count });
});
/**
 * Get all types same filter.
 *
 * @name filter1
 * @path {GET} /api/table/filter1
 * @query {String} [ed] check if url include 'ro(read only)' value
 * @query {String} [a] get filter criterion
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/table
 */
router.get('/filter1',async (req,res)=>{
  let status = false;
  let show= false;
  let items = [];
  try {
    if(req.query.ed && req.query.a){
      show= req.query.ed == 'ro' ? true : (req.session.hasOwnProperty('passport') && (show= req.session.passport.user.level >= 2));
      if( show ){
        items = await Row.find({}).select(`${req.query.a}`).distinct(`${req.query.a}`);
        status= true;
      }
    }
  } catch (err) {console.log(err); status= false; };
  res.json({ status , items });
});
/**
 * Get all articles based filter criterion.
 *
 * @name filter2
 * @path {GET} /api/table/filter2
 * @query {String} [ed] check if url include 'ro(read only)' value
 * @query {String} [f1] get filter criterion
 * @query {String} [f2] get filter type
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @response {number} count total count into database
 * @memberof Backend/route/table
 */
router.get('/filter2',async (req,res)=>{
  let status = false;
  let show= false;
  let items = [];
  let count= 0;
  try {
    if(req.query.ed && req.query.f1 && req.query.f2){
      show= req.query.ed == 'ro' ? true : (req.session.hasOwnProperty('passport') && (show= req.session.passport.user.level >= 2));
      if(show){
        const skip= (Number(req.query.page) * 20) -20;
        items= await Row.find({ [req.query.f1] : `${req.query.f2}` }).skip(skip).limit(20);
        count= await Row.find({ [req.query.f1] : `${req.query.f2}` }).countDocuments();
        status= true;
      }
    }
  } catch (err) {console.log(err); status= false; };
  res.json({ status , items , count });
});
/**
 * Get all articles based filter criterion.
 *
 * @name search1
 * @path {GET} /api/table/search1
 * @query {String} [ed] check if url include 'ro(read only)' value
 * @query {String} [s] get search string received from client
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @response {number} count total count into database
 * @memberof Backend/route/table
 */
router.get('/search1',async (req,res)=>{
  let status = false;
  let show= false;
  let items = [];
  let count= 0;
  try {
    if(req.query.s){
      show= req.query.ed == 'ro' ? true : (req.session.hasOwnProperty('passport') && (show= req.session.passport.user.level >= 2));
      if(show){
        const skip= (Number(req.query.page) * 20) -20;
        const query= [
          { vin: { '$regex': req.query.s } },
          { vehicle: { '$regex': req.query.s } },
          { manufacturer: { '$regex': req.query.s } },
          { model: { '$regex': req.query.s } },
          { type: { '$regex': req.query.s } },
          { fuel: { '$regex': req.query.s } },
          { color: { '$regex': req.query.s } },
        ];
        items= await Row.find({ "$or": query }).skip(skip).limit(20);
        count= await Row.find({ "$or": query }).countDocuments();
        status= true;
      };
    };
  } catch (err) {console.log(err); status= false; };
  res.json({ status , items , count });
});

module.exports = router;