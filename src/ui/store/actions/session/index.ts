const POST_SIGNUP = 'POST_SIGNUP'
const SET_SESSION = 'SET_SESSION'

const POST_LOGIN = 'POST_LOGIN'
const POST_LOGOUT = 'POST_LOGOUT'

const VALIDATE_SESSION = 'VALIDATE_SESSION'

export const SESSION_ACTION_TYPES = {
  POST_SIGNUP,
  POST_LOGIN,
  POST_LOGOUT,
  SET_SESSION,
  VALIDATE_SESSION
}

type AsyncAction = {
  resolve: any
  reject: any
}

export const postSignUp = (body: { username: string, password: string }) => ({
  type: SESSION_ACTION_TYPES.POST_SIGNUP,
  payload: body
})

export const postLogIn = (body: { username: string, password: string }) => ({
  type: SESSION_ACTION_TYPES.POST_LOGIN,
  payload: body
})

export const postLogOut = () => ({
  type: SESSION_ACTION_TYPES.POST_LOGOUT
})

export const validateSession = (body: AsyncAction) => ({
  type: SESSION_ACTION_TYPES.VALIDATE_SESSION,
  meta: {
    deferred: {
      success: body.resolve,
      failure: body.reject
    }
  }
})
