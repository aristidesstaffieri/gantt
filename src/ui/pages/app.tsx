import * as React from 'react'

import { Authentication, AuthType } from '../components/auth'

class App extends React.Component<{}, {}> {

  render() {
    return (
      <div className='app'>
        <Authentication activeAuthType={ AuthType['signup'] }/>
      </div>
    )
  }
}

export { App }
