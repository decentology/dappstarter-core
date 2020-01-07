import React from 'react';
import { Route, Switch } from 'react-router-dom';
import IpfsPage from '../containers/IpfsPage.jsx';
import CustomTokenPage from '../containers/CustomTokenPage.jsx';

class Routes extends React.Component {
  render() {
    return (
        <Switch>
          <Route path='/' exact component={IpfsPage} />
          <Route path='/ipfs' component={IpfsPage} />
          <Route path='/custom-token' component={CustomTokenPage} />
        </Switch>
    );
  }
}

export default Routes;
