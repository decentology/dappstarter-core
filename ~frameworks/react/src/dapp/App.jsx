import React, { Component } from 'react';
import '../dapp/components/shared/top-navigation';
import '../dapp/components/shared/page-footer';
import '../dapp/components/shared/page-navigation';
import ResultPanel from './components/ResultPanel.jsx';

class App extends Component {
  
  render() {
   // let routes = new Routes();
    return (
        <div className="flexible-content">
          <top-navigation />
          <page-navigation />
          <main id="content" className="p-5">
          </main>
          <page-footer />
          <ResultPanel />
        </div>
    );
  }
}

export default App;
