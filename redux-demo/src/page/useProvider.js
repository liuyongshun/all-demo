import React, { Component } from 'react';
const ThemeContext = React.createContext(null);

class Home extends Component {
  constructor () {
    super()
    this.state = {
      changeVal: '首次加载的字符串数据'
    }
  }

  componentDidMount () {
    setTimeout(() => {
      this.setState({
        changeVal: '2秒后加载的字符串数据, 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染'
      })
    }, 2000);
  }

  render() {
    const { changeVal } = this.state
    // 使用一个 Provider 来将当前的 数据 传递给以下的组件树, 无论多深，任何组件都能读取这个值
    return (
      // 当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染
      <ThemeContext.Provider value={changeVal}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件不必指明往下传递
function Toolbar() {
  return (
    <div>
      <HomeGrandson />
    </div>
  );
}

class HomeGrandson extends React.Component {
  // 挂载在 class 上的 contextType [静态属性]会被重赋值为一个由 React.createContext() 创建的 Context 对象
  // 这能让你使用 this.context 来消费最近 Context 上的那个值
  // 你可以在任何生命周期中访问到它，包括 render 函数中
  // 在react-redux中, 经过高阶组件connect统一处理
  static contextType = ThemeContext
  constructor () {
    super()
  }
  componentDidMount() {
    console.log(this.context, 'componentDidMount')
  }
  render() {
    return <div> 这是生产组件 Provider 传递下来的值 "{this.context}" </div>
  }
}

export default Home
