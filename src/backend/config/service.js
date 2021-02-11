const getError= ( err ) => {
  let line= ""
  if( err ){
    if( err.hasOwnProperty('stack') && err.hasOwnProperty('message') ){
      line= ((String(err.stack).split(`\n`))[1]).split(':');
      line=`${line[2]}-${line[3]} -> ${err.message}`;
    }else
      line= "NaN: " + err.toString();
  }
  return line;
}

module.exports = { getError };