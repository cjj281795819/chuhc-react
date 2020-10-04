import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';

const rapList = ['别跟我撒娇也别叫我宝贝', '就算我一个人也不会后退'];

const App = () => {
  return (
    <ul className="container">
      @jye/cli 模板
      {rapList.map(v => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
