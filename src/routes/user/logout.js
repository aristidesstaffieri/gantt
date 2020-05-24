const Joi = require('joi')
const Boom = require('boom')

const sql = require('../../server/libs/sql')

module.exports = (apone, db, passport) => apone.register({
  path: 'logout',
  prefix: 'api',
  method: 'post',
  validation: {
    body: Joi.object().max(0)
  },
  handle: (req, res, next) => {
    req.logout()
    req.session.destroy()
    res.clearCookie('session')

    res.status(200).send({ message: 'success', data: {} })
    return next()
  }
})
