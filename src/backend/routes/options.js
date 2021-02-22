/** @namespace Backend/route/options */

const router = require("express").Router();                         //Call dependencies needed
const { Row } = require('../config/schema.js');  //Call schemas for CRUD about table product, category and client

/**
 * Get several JSONs from client and save into DB articles' collection.
 *
 * @name upTable
 * @path {POST} /api/options/upTable
 * @body {Object} Include all articles for after saved into database
 * @response {boolean} status if query database complety successfully
 * @response {string} message show a text with information result
 * @memberof Backend/route/options
 */
router.post('/upTable',async (req,res)=>{
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
/**
 * Get several JSONs from DB and send to client
 *
 * @name downallTable
 * @path {GET} /api/options/downallTable
 * @response {boolean} status if query database complety successfully
 * @response {Object} items getting from database query result
 * @memberof Backend/route/options
 */
router.get('/downallTable',async (req,res)=>{
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