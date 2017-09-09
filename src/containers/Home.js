import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
  ListGroup,
} from 'react-bootstrap';
import StatusItem from '../components/StatusItem';
import 'moment-timezone';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      today: this.getDateAsString(new Date()),
      isLoading: false,
      users: [],
      viewerHasStatusToday: false,
    };
  }
  
  // from https://medium.com/front-end-hacking/async-await-with-react-lifecycle-methods-802e7760d802
  setStateAsync(state) {
    return new Promise((resolve) => {
      this.setState(state, resolve)
    });
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const theUsers = await this.users();
      await this.setStateAsync({users: theUsers });

      if( theUsers.length > 0 ) {
        theUsers.some(function(user) {
          const itsThisUser = user.userId === this.props.userId;
          const theyHaveaStatus = user.last_status_title ;

          const inputDate = new Date(user.last_status_createdAt);
          const itsFromToday = (inputDate.setHours(0,0,0,0) === new Date().setHours(0,0,0,0))

          if( itsThisUser && theyHaveaStatus && itsFromToday) {
            this.setState({viewerHasStatusToday: true});
            return true;
          }
          return false;
        }, this)
      }
    }
    catch(e) {
      alert(e);
    }
    this.setState({ isLoading: false });
  }

  users() {
    return invokeApig({ path: '/users' }, this.props.userToken);
  }

  getDateAsString(theDate) {
    if( typeof theDate === 'undefined' ) {
      return '';
    } else if( typeof theDate === 'string' ) {
      theDate = new Date(theDate);
    }
    return theDate.toJSON().slice(0,10).replace(/-/g,'/');
  }

  handleStatusClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleStatusClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderUsers() }
      </div>
    );
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>PostUp</h1>
        <p>Sit down, PostUp.</p>
      </div>
    );
  }

  renderUsers() {
    return (
      <div className="users">
        <PageHeader>
          <span>
            <b>
              Team Status for <Moment format="dddd, MMMM Do">{this.state.today}</Moment>
            </b>
          </span>
        </PageHeader>

        <ListGroup>
          { ! this.state.isLoading
            && this.renderUsersList(this.state.users) }
        </ListGroup>
      </div>
    );
  }

  renderUsersList(theUsers) {
    return theUsers.map(function(user) {
      return(
        <StatusItem
          user={user}
          userFullName={user.name}
          userName={user.email}
          userId={user.userId}
          statusId={user.lastStatusId}
          createdAt={user.lastStatusCreatedAt}
          title={user.lastStatusTitle}
          content={user.lastStatusContent}
          key={user.userId}
          hasSubmittedStatus={(this.state.today === this.getDateAsString(user.lastStatusCreatedAt)) ? 'true' : 'false'} />
      );
    }, this);
  }
}

export default withRouter(Home);
