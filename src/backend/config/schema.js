const { Schema, model } = require('mongoose');              //Call methods schema and model from mongoose for create tables that after

//------------------------------------- Product schema -------------------------------------//

const userschema = new Schema({                           //Creo una tabla de nombre UserSchema
  name: { type: String, required: true },                 //Creo una columna llamada name
  fullname: { type: String },
  phone: { type: String },
  password: { type: String, required: true },             //Creo una columna llamada password
  level: { type: Number, required: true },
  depts: { type: Array, required: true },
  date: { type: String }
});

const rowschema = new Schema({
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