const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

router.get('/api/table/row',async (req,res)=>{
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

router.get('/api/table/filter1',async (req,res)=>{
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
  res.json({status,items});
});

router.get('/api/table/filter2',async (req,res)=>{
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

router.get('/api/table/search1',async (req,res)=>{
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