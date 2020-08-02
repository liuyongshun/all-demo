import React, { Component } from 'react';
const ThemeContext = React.createContext(null);

class Home extends Component {
  constructor () {
    super()
    this.state = {
      nameStr: '李四',
      changeName: (val) => {
        this.setState({
          nameStr: val || '默认名字'
        })
      }
    }
  }

  render() {
    // 使用一个 Provider 来将当前的 数据 传递给以下的组件树, 无论多深，任何组件都能读取这个值
    return (
      <ThemeContext.Provider value={this.state}>
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
  render() {
    return (
      <ThemeContext.Consumer>
        {
          ({nameStr, changeName}) => (
            <div>
              <button onClick={() => changeName('张三')}>点击修改名字</button>
              <div>当前名字是{nameStr}</div>
            </div>
          )
        }
      </ThemeContext.Consumer>
    )
  }
}

export default Home
