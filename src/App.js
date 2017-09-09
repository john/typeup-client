import React, { Component } from 'react';
import {
  withRouter,
  Link
} from 'react-router-dom';
import {
  Nav,
  NavItem,
  Navbar
} from 'react-bootstrap';
import AWS from 'aws-sdk';
import Routes from './Routes';
import RouteNavItem from './components/RouteNavItem';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from './config.js';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      userName: null,
      userId: null,
      userFullname: null,
      isLoadingUserToken: true,
    };
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if (currentUser === null) {
      this.setState({isLoadingUserToken: false});
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
      this.setState({userName: this.getCurrentUser().username});

      // const user = await this.getUser(userToken, userName);
      // this.setState({userFullname: user.name});
    }

    catch(e) {
      alert(e);
    }

    this.setState({isLoadingUserToken: false});
  }

  // // TODO: reshare, used in both Status.js and NewStatus.js (which should be renamed)
  // getUser(userToken, userName) {
  //   alert('userName is: ' + userName);
  //   // return invokeApig({ path: `/users/${this.state.userName}` }, userToken);
  //   return invokeApig({ path: `/users/${userName}` }, userToken);
  // }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
      currentUser.getSession(function(err, session) {
        if (err) {
            reject(err);
            return;
        }
        resolve(session.getIdToken().getJwtToken());
      });
    });
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken: userToken
    });
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if (currentUser !== null) {
      currentUser.signOut();
    }

    if (AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }

    this.updateUserToken(null);
    this.props.history.push('/login');
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      userName: this.state.userName,
      updateUserToken: this.updateUserToken,
    }
    // get userName to NewStatus so user can be updated with latest status info
    if( this.state.userToken ) {
      childProps.currentUserName = this.state.userName;
    }

    return ! this.state.isLoadingUserToken
      &&
      (
        <div className="App container">
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">TypeUp</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                { this.state.userToken
                  ? <NavItem onClick={this.handleLogout}>Logout ({this.getCurrentUser().username})</NavItem>
                  : [ <RouteNavItem key={1} onClick={this.handleNavLink} href="/signup">Signup</RouteNavItem>,
                      <RouteNavItem key={2} onClick={this.handleNavLink} href="/login">Login</RouteNavItem> ] }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </div>
      );
  }
}

export default withRouter(App);
