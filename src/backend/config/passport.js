const bcrypt = require('bcrypt');
const passport = require('passport');                                 //Mando a llamar a passport
const LocalStrategy = require('passport-local').Strategy;             //Mando llamar a passport local para poder usar una estrat

const { User } = require('./schema.js');                              //Mando llamar al schema de user

passport.use(new LocalStrategy(
  async (username, password, done) => {
    let client = {};
    const name = username.toLowerCase();
    if(name)
      client = await User.findOne({ name: name });
    
    if(client == null)
      return done(null, false, { message: 'USER NOT REGISTER' });
    else{
      if(client.name == "invitado")
        return done(null, client, { message: 'INVITED ACCOUNT INICIALIZATED' });
      else{
        const match = await bcrypt.compare(password, client.password);
        if(!match)
          return done(null, false, { message: 'PASSWORD NOT CORRECT' });
        else
          return done(null, client, { message: `WELCOME ${ String(client.fullname).toUpperCase() }` });
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