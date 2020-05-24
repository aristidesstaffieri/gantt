import { SESSION_ACTION_TYPES } from '../../actions'

const initialState = {} as State

export type State = {
  email: string,
  created_at: string,
  id: number,
  updated_at: string
}

export default function(state: State = initialState, action: any) {
  switch (action.type) {
    case SESSION_ACTION_TYPES.SET_SESSION: {
      return action.payload
    }
    default:
      return state
  }
}
