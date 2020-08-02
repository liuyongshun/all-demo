import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import { createStore } from './redux/src/index';
import { Provider } from './react-redux/src/index';

// import { createStore } from 'redux';
// import { Provider } from 'react-redux';

import UseProvider from './page/useProvider';
import UseProvider2 from './page/useProvider2';
import UseRedux from './page/useRedux';

// 可以拆出去,作为单独文件, 便于解耦
const reducer = (state = { count: 1 }, action) => {
  if (action.type === 'add') {
    return {
      ...state,
      count: state.count + 1,
    }
  }
  return state;
};

const store = createStore(reducer);

class App extends React.Component {
  constructor() {
    super()
  }
  state = {
    curr: 1,
    tabs: [
      {
        label: 'createContext生产组件和消费组件使用,传递简单字符串',
        value: 1
      },
      {
        label: 'createContext生产组件和消费组件使用,传递对象和函数',
        value: 2
      },
      {
        label: '纯 redux 使用的demo',
        value: 3
      }
    ]
  }

  render() {
    const { tabs, curr } = this.state
    return (
      <div >
        <style>
          {
            `
            ul {
              list-style: none;
              overflow: hidden;
            }
            ul li {
              padding: 4px 12px;
              border: 1px solid #ddd;
              margin: 10px 5px;
              cursor: pointer;
            }
            `
          }
        </style>
        <ul>
          {
            tabs.map((n, i) => (<li key={n.value} onClick={() => {this.setState({curr: n.value})}}>{n.label}</li>))
          }
        </ul>
        {/* ==================== */}
        <div style={{padding: '30px', border: '1px solid #ddd', margin: '24px'}}>
          {curr === 1 ? <UseProvider /> : null}
          {curr === 2 ? <UseProvider2 /> : null}
          {curr === 3 ? <UseRedux /> : null}
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />,
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
