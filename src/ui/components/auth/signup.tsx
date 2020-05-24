import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'

import { postSignUp } from '../../store/actions'

// const { useState, useEffect } = React

interface Props {
  postSignUp: (body: { username: string, password: string }) => void
}

interface State {
  username: string
  password: string
}

class SignUpView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }

    this.handleFormChange = this.handleFormChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleFormChange(event: any) { //React.ChangeEvent<HTMLInputElement>
    const state = {
      [event.target.name]: event.target.value
    } as State
    this.setState(state)
  }

  handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    this.props.postSignUp(this.state)
    event.preventDefault()
  }

  render() {
    return (
      <div>
        SignUp
        <form onSubmit={this.handleSubmit}>
          <label>
            Username:
            <input type="text" name="username" value={ this.state.username } onChange={this.handleFormChange} />
          </label>
          <label>
            Password:
            <input type="text" name="password" value={ this.state.password } onChange={this.handleFormChange} />
          </label>

          <input type='submit' value='Sign Up' />
        </form>
      </div>
    )
  }
}

const mapStateToProps = (_state: any) => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    postSignUp: (body: { username: string, password: string }) => dispatch(postSignUp(body))
  }
}

export const SignUp = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUpView)
