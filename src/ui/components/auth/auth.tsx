import * as React from 'react'

import { SignUp, LogIn } from './index'

enum AuthType {
  login = 'login',
  signup = 'signup'
}

interface Props {
  activeAuthType: AuthType
}

interface State {
  activeFormType: AuthType
}

const renderAuthComponent = function(type: AuthType) {
  switch(type) {
    case AuthType['login']:
      return <LogIn />
    case AuthType['signup']:
      return <SignUp />
  }
}

const getOppositeAuthType = function(type: AuthType) {
  switch(type) {
    case AuthType['login']:
      return AuthType['signup']
    case AuthType['signup']:
      return AuthType['login']
  }
}

class AuthenticationView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      activeFormType: props.activeAuthType
    }
    this.setActiveForm = this.setActiveForm.bind(this)
  }

  setActiveForm() {
    this.setState({
      activeFormType: getOppositeAuthType(this.state.activeFormType)
    })
  }

  render() {
    const {
      activeFormType
    } = this.state

    return (
      <div className='authentication'>
        <div className='auth_form'>
          { renderAuthComponent(activeFormType) }
          <h4>Or you can <span onClick={ this.setActiveForm }>{ getOppositeAuthType(activeFormType) }</span></h4>
        </div>
      </div>
    )
  }
}

const Authentication = AuthenticationView
export { Authentication, AuthType }
