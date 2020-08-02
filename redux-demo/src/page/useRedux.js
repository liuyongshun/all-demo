import React, { Component } from 'react';
// redux 本身不依赖框架, 其主要功能,是让我们的数据变更变得可控, 修改数据只能通过 dispatch, 展现数据只能通过 state 的objec tree 获取
import { createStore } from '../redux/src/index';

// 可以拆出去,作为单独文件, 便于解耦
const reducer = (state = { count: 0 }, action) => {
  if (action.type === 'add') {
    return {
      ...state,
      count: state.count + 1,
    }
  }
  return state;
};

// createStore 会返回一些通用方法 return {dispatch, subscribe, getState, replaceReducer }
const store = createStore(reducer);

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dispatchToggle: '监听dispatch触发0',
    }
  }
  click = () => {
    // 只能通过 dispatch 触发修改数据源
    store.dispatch({ type: 'add' })
  }

  componentDidMount () {
    // 可以监听每次 dispatch 便于处理数据
    const unsubscribe = store.subscribe(this.changeHandle)

    // store.subscribe 返回一个卸载监听函数, 在需要卸载监听的时候调用 this.unsubscribe()
  }

  changeHandle = () => {
    // 使用 getState 获取整个 object tree ,进而展现数据
    const state = store.getState();
    this.setState({
      dispatchToggle: `监听dispatch触发${state.count}`
    })
  }

  render() {
    const { dispatchToggle } = this.state
    return (
      <div >
        <p>{dispatchToggle}</p>
        <button onClick={this.click}>点击+1</button>
      </div>
    )
  }
}

export default App

