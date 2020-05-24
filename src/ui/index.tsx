import * as React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { Dispatch, Action } from 'redux'

import { validateSession } from './store/actions'
import store from './store'

import {
  Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { history } from './utilities'

import {
  App,
  Home
} from './pages'

import { AsyncRender } from './components/async-render'

const root = document.createElement('div')
root.setAttribute('id', 'root')
document.body.appendChild(root)

import './styles/index.scss'

/*
  How do we route users?

  PrivateRoute redirects to / on missing or expired sessions
  PrivateRoutes should be a sub router with /dashboard as default
  / Route should logout any session with an async render effect
*/

interface PrivateRouteProps {
  component: any // ReactComponent,
  validateSession: () => any
  [index: string]: any
}

const PrivateRouteView: React.FunctionComponent<PrivateRouteProps> = (props) => {

  const { validateSession, component, ...rest } = props
  const Component = component

  return (
    <AsyncRender
      asyncRender={ validateSession }
      renderComponent={(props: any) => {
        return (
          <Route
            {...rest}
            render={(routeProps: any) => {
              return (
                props.isAuthenticated ? (
                  <Component {...routeProps} />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/',
                      state: { from: routeProps.location }
                    }}
                  />
                )
              )
            }}
          />
        )
      }}
     />
  )
}

const mapStateToProps = (_state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    validateSession: () => {
      return new Promise((resolve, reject) => {
        dispatch(validateSession({ resolve, reject }))
      })
    }
  }
}

const PrivateRoute = connect(
  mapStateToProps,
  mapDispatchToProps
)(PrivateRouteView)

render(
  <Provider store={store}>
    <Router history={ history }>
      <Switch>
        <PrivateRoute path='/dashboard' component={Home} />
        <Route path='/' component={App} />
      </Switch>
    </Router>
  </Provider>,
  root
)
