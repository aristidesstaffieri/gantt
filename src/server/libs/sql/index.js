/*
  Interface into DB, all functions return promises for DB queries.
*/


module.exports = {

  getUserById: function getUserById(id, db) {
    const query = 'select * from users where id = ${ id }::uuid'
    return db.oneOrNone(query, { id })
  },

  getUserByUsername: function getUserByUsername(username, db) {
    const query = 'select * from users where email = ${username}'
    return db.oneOrNone(query, { username })
  },

  insertNewUser: function insertNewUser(email, password, db) {
    const query = 'insert into users (email, password, org_id) values (${ email }, ${ password }, ${ orgId }::uuid) returning email, created_at, id, updated_at'
    return db.one(query, { email, password, orgId: 1 })
  },

  insertNewOrganization: function insertNewOrganization(orgName, db) {
    const query = 'insert into organizations (name) values (${ orgName }) returning id'
    return db.one(query, { orgName })
  },

  insertNewTeam: function insertNewTeam(teamName, db) {
    const query = 'insert into teams (name) values (${ teamName }) returning id'
    return db.one(query, { teamName })
  },

  signUpNewOrg: function signUpNewOrg(email, password, orgName='org 1', db) {
    // need to use org id in other two queries currval("organizations_id_seq")
    const queryOrg = 'insert into organizations (name) values ($1) returning id'
    const queryUser = 'insert into users (email, password, org_id) values (${ email }, ${ password }, ${ orgId }::uuid) returning org_id'
    const queryTeam = 'insert into teams (name, org_id) values (${ name }, ${ orgId }::uuid) returning id'

    return db.tx(t => {
      return t.one(queryOrg, orgName)
        .then(orgId => {
          const { id } = orgId
          const q2 = t.one(queryUser, { email, password, orgId: id })
          const q3 = t.one(queryTeam, { name: orgName, orgId: id })
          return t.batch([
            q2, q3
          ])
        })

    })
  },

  createNewProject: function createNewProject(userId, project, db) {
    // this should turn into a transaction where it also adds a row to map_access_entities for this record
    const query = 'insert into projects (creator_id, project) values (${ userId }::uuid, ${ project }) returning id'
    return db.one(query, { userId, project })
  },

  editProject: function editProject(userId, updatedProject, docId, db) {
    // could set updator_ids like
    // https://stackoverflow.com/questions/43628837/postgres-append-or-set-each-elementsif-not-exists-of-an-array-to-an-array-colu
    const query = 'update projects set project = ${updatedProject}, updated_at = now() where creator_id = ${userId}::uuid and id = ${docId}::uuid'
    return db.none(query, { userId, docId, updatedProject })
  },

  getProjects: function getDocuments(userId, db) {
    const query = 'select * from projects where creator_id = ${userId}'
    return db.manyOrNone(query, { userId })
  },

  getUserRoles: function getUserRoles(userId) {
    const query = 'select * from map_user_role where user_id = ${userId}::uuid'
    return db.manyOrNone(query, { userId })
  }

}
