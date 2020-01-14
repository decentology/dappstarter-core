import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Pages from '../helpers/pages';
import HomePage from './HomePage.jsx';
import TokenPage from '../containers/TokenPage.jsx';


class Routes extends React.Component {
  render() {

    let pages = Pages.get();

    return (
        <Switch>
          <Route path='/' exact component={HomePage} />
          {pages.map((page) => {
            return <Route path={page.route} component={TokenPage} />
          })}
        </Switch>
    );
  }
}

export default Routes;
