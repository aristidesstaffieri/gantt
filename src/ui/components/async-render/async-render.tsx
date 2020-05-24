import * as React from 'react'

type AsyncRenderProps<T> = {
  asyncRender: () => Promise<T>
  renderComponent: React.FunctionComponent<{ isAuthenticated: Boolean }>
  errorComponent?: React.FunctionComponent<{ error: unknown }>
  loadingComponent?: React.FunctionComponent
}

type AsyncRenderState = {
  isResolved: boolean
  result?: any
  error?: unknown
}

export function AsyncRender<T>(props: AsyncRenderProps<T>) {

  const renderError = function(error: unknown) {
    return props.errorComponent
      ? props.errorComponent({ error })
      : <p>Error!</p>
  }

  const renderLoader = function() {
    return props.loadingComponent
      ? props.loadingComponent({})
      : <p>Loading...</p>
  }

  const [state, dispatch] = React.useReducer(
    asyncRenderReducer,
    {
      isResolved: false,
      result: undefined,
      error: undefined
    }
  )

  React.useEffect(
    () => {
      let isCancelled = false

      props.asyncRender()
        .then(
          (result: T) => {
            if (!isCancelled) {
              dispatch(ResolveAction(result))
            }
        },
        (error: unknown) => {
            if (!isCancelled) {
              dispatch(RejectAction(error))
            }
        })

      return () => {
        isCancelled = true
      }
    }, [props.asyncRender]
  )

  if (state.isResolved) {
    return state.error ? renderError(state.error) : props.renderComponent({ isAuthenticated: state.result.data.authenticated })
  } else {
    return renderLoader()
  }

}

enum TypeKeys {
  Error = 'ERROR',
  Success = 'SUCCESS'
}

function RejectAction(payload: unknown): { type: TypeKeys.Error, payload: unknown} {
  return {
    type: TypeKeys.Error,
    payload
  }
}

function ResolveAction(payload: unknown): { type: TypeKeys.Success, payload: unknown} {
  return {
    type: TypeKeys.Success,
    payload
  }
}

type AsyncActionTypes =
  | ReturnType<typeof RejectAction>
  | ReturnType<typeof ResolveAction>

function asyncRenderReducer(state: AsyncRenderState, action: AsyncActionTypes) {
  switch(action.type) {
    case TypeKeys.Error:
      return {
        ...state,
        isResolved: true,
        error: action.payload
      }

    case TypeKeys.Success:
      return {
        ...state,
        isResolved: true,
        result: action.payload
      }

    default:
      return state
  }
}
