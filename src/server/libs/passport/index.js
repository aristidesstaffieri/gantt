const Boom = require('boom')

const LocalStrategy = require('passport-local').Strategy
const sql = require('../sql')
const { isValidPassword } = require('../../../utilities')

module.exports = function(passport, db) {
  return {
    configureLocalStrategy: () => {
      passport.use(new LocalStrategy(
        function(username, password, done) {
          sql.getUserByUsername(username, db)
            .then(function(data) {
              if (!data) {
                return done(null, false)
              }
              if (!isValidPassword(password, data.password)) {
                return done(null, false)
              }

              return done(null, data)
            })
            .catch(function(err) {
              return done(err)
            })
        }
      ))
    },
    serializeUser: () => passport.serializeUser(function(user, done) {
      done(null, user.id)
    }),

    deserializeUser: () => passport.deserializeUser(function(userId, done) {
      sql.getUserById(userId, db)
        .then(data => {
            done(null, data)
          })
        .catch(err => {
          const error = new Boom(err.message, { statusCode: 500 })
          // req.log.error(error)
          return done(error)
        })
    })
  }
}
