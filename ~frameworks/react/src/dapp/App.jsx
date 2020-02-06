import React, { Component } from 'react';
import '../dapp/components/shared/top-navigation';
import '../dapp/components/shared/page-footer';
import '../dapp/components/shared/page-navigation';
import '../dapp/components/shared/page-loader';
import '../dapp/components/pages/home-page';
import '../dapp/components/pages/dapp-page';
import '../dapp/components/pages/admin-page';
import ResultPanel from './components/ResultPanel.jsx';

class App extends Component {
  
  render() {
   // let routes = new Routes();
    return (
        <div className="flexible-content">
          <top-navigation collapse="true" />
          <page-navigation />
          <page-loader id="page-loader" />
          <page-footer />
          <ResultPanel />
        </div>
    );
  }
}

export default App;
