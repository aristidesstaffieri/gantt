import { call, put, takeEvery } from 'redux-saga/effects'
import Catch from 'redux-saga-try-catch'

import { SESSION_ACTION_TYPES } from '../../actions'
import Api from '../../api'
import { history } from '../../../utilities'

const IO = {
  stdout: console.log
}

export function* postSignUp(_io: typeof IO, action: any) {
  const { data } = yield call(Api.session.postSignUp, action.payload)
  yield put({ type: SESSION_ACTION_TYPES.SET_SESSION, payload: data })

  history.push('/dashboard')
}

export function* postLogIn(_io: typeof IO, action: any) {
  const { data } = yield call(Api.session.postLogIn, action.payload)
  yield put({ type: SESSION_ACTION_TYPES.SET_SESSION, payload: data })

  history.push('/dashboard')
}

export function* postLogOut(_io: typeof IO, _action: any) {
  const body = yield call(Api.session.postLogOut)
  yield put({ type: SESSION_ACTION_TYPES.SET_SESSION, payload: body })

  history.push('/')
}

export function* validateSession(_io: typeof IO, _action: any) {
    const body = yield call(Api.session.getSessionValidation)
    // should it return user here?
    yield put({ type: SESSION_ACTION_TYPES.SET_SESSION, payload: body })

    return body
}

export function* watchSessionSagas() {
  yield takeEvery(SESSION_ACTION_TYPES.POST_SIGNUP, Catch.standardAction(postSignUp, IO))
  yield takeEvery(SESSION_ACTION_TYPES.POST_LOGIN, Catch.standardAction(postLogIn, IO))
  yield takeEvery(SESSION_ACTION_TYPES.POST_LOGOUT, Catch.standardAction(postLogOut, IO))
  yield takeEvery(SESSION_ACTION_TYPES.VALIDATE_SESSION, Catch.deferredAction(validateSession, IO))
}

export default {
  watchSessionSagas
}
