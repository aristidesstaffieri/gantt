const Joi = require('joi')
const Boom = require('boom')


module.exports = (apone) => apone.register({
  path: 'validate',
  prefix: 'api',
  method: 'get',
  handle: (req, res, next) => {
    res.status(200).send({ message: 'success', data: { authenticated: req.isAuthenticated() } })

    return next()
  }
})
