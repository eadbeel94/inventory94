const { connect } = require('mongoose');                  //Call connect method with URI and configuration   

connect(process.env.MONGO_DB_URI,{                                  
  useNewUrlParser: true,                                          
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch( err => { console.log('error',err.message)})      //If exist a error, print message
  .then( db => { if(db){console.log('DB connected')} });   //if connection complety succefully, then print OK message
  