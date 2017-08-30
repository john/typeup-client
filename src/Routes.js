import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import Login from './containers/Login';
import AppliedRoute from './components/AppliedRoute';
import Home from './containers/Home';
import NewStatus from './containers/NewStatus';
import User from './containers/User';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/users/:userId/statuses/new" exact component={NewStatus} props={childProps} />
    <AppliedRoute path="/users/:userId/statuses/:statusId/edit" exact component={NewStatus} props={childProps} />
    <AppliedRoute path="/users/:userId" exact component={User} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);
