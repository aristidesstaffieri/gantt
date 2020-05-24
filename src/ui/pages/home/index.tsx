import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch, Action } from 'redux'

import {
  postLogOut
} from '../../store/actions'

interface Props {}

const HomeView: React.FunctionComponent<Props> = (_props) => {
  return (
    <div className='app_container'>

    </div>
  )
}

const mapStateToProps = (state: any) => {
  return {
    documents: state.documents
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => {
  return {
    postLogOut: () => dispatch(postLogOut())
  }
}

export const Home = connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeView)
