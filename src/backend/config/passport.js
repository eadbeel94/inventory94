const bcrypt = require('bcrypt');                                     //Call bcrypt library
const passport = require('passport');                                 //Call passport library
const LocalStrategy = require('passport-local').Strategy;             //Use local strategy for authentification

const { User } = require('./schema.js');                              //Call just schema user

passport.use(new LocalStrategy(
  async (username, password, done) => {                               //Get username and password from authetification client form
    let client = {};
    const name = username.toLowerCase();
    if(name)
      client = await User.findOne({ name: name });                    //Check if user exist into database
    
    if(client == null)
      return done(null, false, { message: 'USER NOT REGISTER' });     //Error message if user doesn't exist
    else{
      if(client.name == "guest")                                      //Show message if user is a Guest
        return done(null, client, { message: 'GUEST ACCOUNT INICIALIZATED' });
      else{
        const match = await bcrypt.compare(password, client.password);  //If user exist then check password
        if(!match)
          return done(null, false, { message: 'PASSWORD NOT CORRECT' });    //IF password doesn't  correct, then show error message
        else
          return done(null, client, { message: `WELCOME ${ String(client.fullname).toUpperCase() }` });   //if is correct, then show ok message
      }
    }
  }
));

passport.serializeUser((info, done) => {
  done(null, { id: info._id, level: info.level, name: info.name } );
});
 
passport.deserializeUser((data, done) => {
  User.findById({ '_id': data.id }, (err, user) => {
    done(err, user);
  });
}); 