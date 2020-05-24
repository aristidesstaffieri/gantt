const config = require('config')
const PgPromise = require('pg-promise')()

if (config.has('pg')) {
  var pgConfig = config.get('pg')
} else {
  throw('No Postgres configuration available, provide a config/default.json with a pg configuration object')
}

const db = PgPromise(pgConfig)

if (config.has('session')) {
  var { name, secret, secure, maxAge } = config.get('session')
} else {
  throw('No Session config available, provide a config/default.json with a session configuration object')
}

module.exports = {
  pgConfig,
  db,
  sessionName: name,
  sessionSecret: secret,
  sessionSecure: secure,
  sessionMaxAge: maxAge
}
