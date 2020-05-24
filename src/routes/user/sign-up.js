const Joi = require('joi')
const Boom = require('boom')

const { createHash } = require('../../utilities')
const sql = require('../../server/libs/sql')

module.exports = (apone, db, passport) => apone.register({
  path: 'sign-up',
  prefix: 'api',
  method: 'post',
  validation: {
    body: Joi.object().keys({
      username: Joi.string(),
      password: Joi.string(),
      organizationName: Joi.string()
    })
  },
  handle: (req, res, next) => {
    const {
      username,
      password,
      organizationName
    } = req.body

    sql.getUserByUsername(username, db)
      .then(function(data) {
        /*
          Steps-
          Check for username, if username exists, 200 and send email to prompt login
          otherwise, 200 and create account, then login
        */

        if (data) {
          // needs to allow for sign up with existing user to complete
          // workflow and email account, to not reveal users in the system
          // could sign them in if password works, email if not
          console.info('User exists, need to email and/or prompt for login')
          return next()
        }

        sql.signUpNewOrg(username, createHash(password), organizationName, db)
          .then(function(data) {
            // orgID, and ID
            if (!data.id) {
              const error = Boom.badImplementation('error', { statusCode: 500 })
              res.status(500).send(error)
            }

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

                res.status(200).send({ message: 'success', data: resUser })
              })
            })(req, res, next)

            // end login
            // res.send(data)
          })
          .catch(function(err) {
            console.error('insert error', err)
            return next(err)
          })
      })
      .catch(function(err) {
        console.error('find error', err)
        return next(err)
      })
  }
})
