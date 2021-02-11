const { connect } = require('mongoose');                              //Call mongoose module for create connection with mongodb

connect('mongodb+srv://Adbeel:t8AFO1MnrwGeHi5M@cluster0-0n1tc.mongodb.net/inventory?retryWrites=true&w=majority',{                       //Call connect method with URI and configuration             
  useNewUrlParser: true,                                          
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).catch( err => { console.log('error',err.message)})      //If exist a error, print message
  .then( db => { if(db){console.log('DB connected')} });   //if connection complety succefully, then print OK message
  