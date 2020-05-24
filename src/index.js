const Express = require('express')
const BodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')
const pgSession = require('connect-pg-simple')(session)
const cors = require('cors')
const Joi = require('joi')
const Apone = require('apone')
const helmet = require('helmet')
const responseTime = require('response-time')
const hpp = require('hpp')
const contentLength = require('express-content-length-validator')
const Boom = require('boom')
const buildPassport = require('./server/libs/passport')

const MAX_CONTENT_LENGTH_ACCEPTED = 9999

const corsOptions = {
  origin: 'http://localhost:8080',
  optionSuccessStatus: 200,
  credentials: true,
}

let {
  db,
  sessionName,
  sessionSecret,
  sessionSecure,
  sessionMaxAge
} = require('./config.js')

let app = Express()
let apone = new Apone(app)
if (process.env.NODE_ENV !== 'production') {
  app.use(cors(corsOptions))
}

let sessionConfig = {
  name: sessionName,
  secret: sessionSecret,
  // genid: function(req) {
  //   return genuuid() // use UUIDs for session IDs
  // },
  cookie: {
    httpOnly: process.env.NODE_ENV === 'production',
    secure: sessionSecure,
    maxAge: sessionMaxAge
  },
  saveUninitialized: false,
  resave: true,
  rolling: true
}

const pgSessionConfig = Object.assign({}, sessionConfig, { store: new pgSession({ pgPromise: db }) })

app.use(session(pgSessionConfig))
app.use(passport.initialize())
app.use(passport.session())

const {
  serializeUser,
  deserializeUser,
  configureLocalStrategy
} = buildPassport(passport, db)

configureLocalStrategy()
serializeUser()
deserializeUser()


app.use(helmet())
app.use(BodyParser.json({ limit: '1mb' }))
app.use(BodyParser.urlencoded({ extended: true }))

app.use(responseTime((req, res, time) => {
  console.info(`${(req.method + req.url).toLowerCase()} - ${time}ms`)
}))
app.use(hpp())
app.use(contentLength.validateMax({
  max: MAX_CONTENT_LENGTH_ACCEPTED, status: 400, message: 'Bad Request'
}))

require('./routes')(apone, db, passport)

app.use(function ensureLoggedIn() {
  return function(req, res, next) {
    // isAuthenticated is set by `deserializeUser()`
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      res.status(401).send({
        success: false,
        message: 'Unauthenticated'
      })
    } else {
      next()
    }
  }
})

app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }

  console.log({err})

  const error = Boom.badImplementation(err.message, { statusCode: 500 })
  console.error(error)

  return res.status(500).send(error)
})

app.listen(3000)
console.info('listening on 3000')
