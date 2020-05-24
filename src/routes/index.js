module.exports = function initRoutes(apone, db, passport) {
  require('./user/sign-up.js')(apone, db, passport)
  require('./user/login.js')(apone, db, passport)
  require('./user/logout.js')(apone, db, passport)
  require('./user/validate-session.js')(apone)
  require('./projects/new-project.js')(apone, db)
  require('./projects/get-projects.js')(apone, db)
  require('./projects/update-project.js')(apone, db)
}
