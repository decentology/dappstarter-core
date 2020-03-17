import React, { Component } from 'react';
import './pages/components/top-navigation';
import './pages/components/page-footer';
import './pages/components/page-navigation';
import './pages/components/page-loader';
import '../dapp/pages/dapp-page';
import '../dapp/pages/admin-page';

class App extends Component {
  
  render() {
   // let routes = new Routes();
    return (
        <div className="flexible-content">
          <top-navigation collapse="true" />
          <page-navigation />
          <page-loader id="page-loader" />
          <page-footer />
        </div>
    );
  }
}

export default App;
