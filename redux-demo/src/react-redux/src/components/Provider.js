import React, { Component } from 'react'
import { ReactReduxContext } from './Context'

class Provider extends Component {
  constructor(props) {
    super(props)
    const { store } = props
    this.state = {
      storeState: store.getState(),
      store
    }
  }

  componentDidMount() {
    this.subscribe()
  }

  componentWillUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

  componentDidUpdate(prevProps) {
    if (this.props.store !== prevProps.store) {
      if (this.unsubscribe) this.unsubscribe()
      this.subscribe()
    }
  }

  subscribe() {
    const { store } = this.props
    this.unsubscribe = store.subscribe(() => {
      console.log('listering,listering,listering');
      const newStoreState = store.getState()
      this.setState(providerState => {
        if (providerState.storeState === newStoreState) {
          return null
        }
        return { storeState: newStoreState }
      })
    })
    const postMountStoreState = store.getState()
    if (postMountStoreState !== this.state.storeState) {
      this.setState({ storeState: postMountStoreState })
    }
  }

  render() {
    const Context = this.props.context || ReactReduxContext
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    )
  }
}

export default Provider
