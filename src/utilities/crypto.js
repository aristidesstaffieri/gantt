const bCrypt = require('bcrypt')

var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10))
}

var isValidPassword = function(password, storedHash){
  return bCrypt.compareSync(password, storedHash)
}

module.exports = {
  createHash,
  isValidPassword
}
