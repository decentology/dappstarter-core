import React, { Component } from 'react';
import Routes from './components/Routes.jsx';
import TopNavigation from './components/TopNavigation.jsx';
import SideNavigation from './components/SideNavigation.jsx';
import Footer from './components/Footer.jsx';
import ResultPanel from './components/ResultPanel.jsx';

class App extends Component {
  
  render() {
    return (
        <div className="flexible-content">
          <TopNavigation />
          <SideNavigation />
          <main id="content" className="p-5">
            <Routes />
          </main>
          <Footer />
          <ResultPanel />
        </div>
    );
  }
}

export default App;
