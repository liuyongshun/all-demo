
import { ReactReduxContext } from '../components/Context'
import React, { PureComponent } from 'react'

// ====================================================================================================
function connectAdvanced(mapStateToProps, mapDispatchToProps, mergeProps) {
  return function connectHOC(WrappedComponent) {
    class Connect extends PureComponent {
      constructor(props) {
        super(props)
      }
      renderWrappedComponent = (value) => {
        const { storeState, store } = value
        const sourceSelector = selectorFactory(store.dispatch, { mapStateToProps, mapDispatchToProps, mergeProps })
        const nextProps = sourceSelector(storeState, this.props)
        return <WrappedComponent {...nextProps}/>
      }

      render() {
        const ContextToUse = ReactReduxContext
        return (
          <ContextToUse.Consumer>
            {this.renderWrappedComponent}
          </ContextToUse.Consumer>
        )
      }
    }
    return Connect
  }
}

// =================================================================================================================
function allMergeProps() {
  return function defaultMergeProps (stateProps, dispatchProps, ownProps) {
    return { ...ownProps, ...stateProps, ...dispatchProps }
  }
}

function initProxySelector(mapToProps) {
  const proxy = function mapToPropsProxy(stateOrDispatch) {
    return proxy.mapToProps(stateOrDispatch)
  }

  proxy.mapToProps = function detectFactoryAndVerify(stateOrDispatch) {
    proxy.mapToProps = mapToProps
    let props = proxy(stateOrDispatch)
    if (typeof props === 'function') {
      proxy.mapToProps = props
      props = proxy(stateOrDispatch)
    }
    return props
  }
  return proxy
}

// ==========================selectorFactory.js===================================================================================================

function selectorFactory(dispatch, { mapStateToProps, mapDispatchToProps, mergeProps }) {
  let state
  let ownProps
  let stateProps
  let dispatchProps
  let mergedProps

  function handleFirstCall(firstState, firstOwnProps) {
    state = firstState
    ownProps = firstOwnProps
    stateProps = mapStateToProps(state)
    dispatchProps = mapDispatchToProps(dispatch)
    mergedProps = mergeProps(stateProps, dispatchProps)
    return mergedProps
  }

  return function pureFinalPropsSelector(nextState, nextOwnProps) {
    return handleFirstCall(nextState, nextOwnProps)
  }
}

// ============================================connect.js=================================================================================
export function createConnect() {
  return function connect(mapStateToProps, mapDispatchToProps, mergeProps) {
    const initMapStateToProps = initProxySelector(mapStateToProps)
    const initMapDispatchToProps = initProxySelector(mapDispatchToProps)
    const initMergeProps = allMergeProps()
    return connectAdvanced(initMapStateToProps, initMapDispatchToProps, initMergeProps)
  }
}

export default createConnect()
