import { all } from 'redux-saga/effects'

import sessionSaga from './session'

export default function* rootSaga() {
  yield all([
    sessionSaga.watchSessionSagas()
  ])
}
