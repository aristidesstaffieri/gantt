const Joi = require('joi')
const Boom = require('boom')

const sql = require('../../server/libs/sql')

module.exports = (apone, db) => apone.register({
  path: 'projects',
  prefix: 'api',
  method: 'get',
  handle: (req, res, next) => {

    sql.getProjects(req.user.id, db)
      .then(function(data) {
        res.status(200).send({ message: 'success', data })
        return next()
      })
      .catch(function(error) {
        return next(error)
      })

  }
})
