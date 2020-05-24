const Joi = require('joi')
const Boom = require('boom')

const sql = require('../../server/libs/sql')

module.exports = (apone, db, passport) => apone.register({
  path: 'login',
  prefix: 'api',
  method: 'post',
  validation: {
    body: Joi.object().keys({
      username: Joi.string(),
      password: Joi.string()
    })
  },
  handle: (req, res, next) => {
    const {
      username,
      password
    } = req.body

    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) {
        return res.send(Boom.unauthorized('invalid credentials'))
      }

      req.login(user, function(err) {
        if (err) { return next(err) }

        const resUser = {
          email: user.email,
          created_at: user.created_at,
          id: user.id,
          updated_at: user.updated_at
        }

        return res.status(200).send({ message: 'success', data: resUser })
      })
    })(req, res, next)

  }
})
