const Joi = require('joi')
const Boom = require('boom')

const sql = require('../../server/libs/sql')

module.exports = (apone, db) => apone.register({
  path: 'projects',
  prefix: 'api',
  method: 'post',
  validation: {
    body: Joi.object().keys({
      document: Joi.object({}).unknown()
    })
  },
  handle: (req, res, next) => {
    const { project } = req.body

    if (!req.user) {
      return res.send(Boom.unauthorized('invalid credentials'))
    }

    sql.createNewProject(req.user.id, project, db)
      .then(function(data) {
        res.status(200).send({ message: 'success', data })
        return next()
      })
      .catch(function(error) {
        return next(error)
      })

  }
})
