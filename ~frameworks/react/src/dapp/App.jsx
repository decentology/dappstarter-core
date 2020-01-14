import React, { Component } from 'react';
import Routes from './components/Routes.jsx';
import '../lib/components/top-navigation';
import '../lib/components/page-footer';
import SideNavigation from './components/SideNavigation.jsx';
import ResultPanel from './components/ResultPanel.jsx';

class App extends Component {
  
  render() {
    return (
        <div className="flexible-content">
          <top-navigation />
          <SideNavigation />
          <main id="content" className="p-5">
            <Routes />
          </main>
          <page-footer />
          <ResultPanel />
        </div>
    );
  }
}

export default App;
