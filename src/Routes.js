import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from './containers/NotFound';
import Signup from './containers/Signup';
import Login from './containers/Login';
import AppliedRoute from './components/AppliedRoute';
import Home from './containers/Home';
import NewStatus from './containers/NewStatus';
import Status from './containers/Status';

export default ({ childProps }) => (
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/login" exact component={Login} props={childProps} />
    <AppliedRoute path="/signup" exact component={Signup} props={childProps} />
    <AppliedRoute path="/statuses/new" exact component={NewStatus} props={childProps} />
    <AppliedRoute path="/statuses/:id" exact component={Status} props={childProps} />
    <Route component={NotFound} />
  </Switch>
);
