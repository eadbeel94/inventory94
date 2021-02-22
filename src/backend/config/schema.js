const { Schema, model } = require('mongoose');            //Call methods schema and model from mongoose for create tables that after

//------------------------------------- Product schema -------------------------------------//

const userschema = new Schema({                           //Create a table for storage multiple user account
  name: { type: String, required: true },                 
  fullname: { type: String },
  phone: { type: String },
  password: { type: String, required: true },             
  level: { type: Number, required: true },
  depts: { type: Array, required: true },
  date: { type: String }
});

const rowschema = new Schema({                            //Create a table for storage multiple vehicles
  vehicle: { type: String, required: true },
  color: { type: String },
  fuel: { type: String },
  manufacturer: { type: String },
  model: { type: String },
  type: { type: String },
  vin: { type: String , required: true, unique: true }
});

//------------------------------------- Export Schemas -------------------------------------//

module.exports.Row = model('catalogs', rowschema);
module.exports.User = model('users', userschema);