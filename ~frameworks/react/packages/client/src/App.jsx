import React, { Component } from 'react';
import './components/top-navigation';
import './components/page-loader';
import './pages/dapp';

class App extends Component {
  
  render() {
    return (
        <div className="flexible-content">
          <top-navigation collapse="true" />
          <page-loader id="page-loader" />
        </div>
    );
  }
}

export default App;
