import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.getDate(new Date());

    this.state = {
      today: this.getDate(new Date()),
      isLoading: false,
      users: [],
      statusButtonPath: "/statuses/new",
      statusButtonLabel: "Add status",
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const results = await this.users();
      this.setState({ users: results });

      // loop through users, see if this user has a status for today, if so set hasTodayStatus
      if( this.state.users.length > 0 ) {
        this.state.users.forEach(function(elem) {
          if( elem.userName === this.props.userName && 'last_status_title' in elem) {
            this.setState({statusButtonPath: "/statuses/edit"});
            this.setState({statusButtonLabel: "Edit status"});
          }
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

  getDate(theDate) {
    if( (typeof theDate) == 'string' ) {
      theDate = new Date(theDate);
    }
    return theDate.toJSON().slice(0,10).replace(/-/g,'/');
  }

  // This should return a list of users, with either the status summary of each, or an indication they haven't submitted it yet.
  renderUsersList(users) {

    return [].concat(users).map((user, i) => (
      <ListGroupItem
        key={user.userName}
        href={`/users/${user.name}`}
        onClick={this.handleStatusClick}
        className={(this.state.today === this.getDate(user.last_status_createdAt)) ? 'today' : 'not-today'}
        header={user.name}>
          { "Status: " + user.last_status_title }
      </ListGroupItem>
    ));
  }

  handleStatusClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  handleStatusClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>PostUp</h1>
        <p>Dont Get Up. PostUp!</p>
      </div>
    );
  }

  renderUsers() {
    return (
      <div className="users">
        <PageHeader>
          <span>
            <b>
              Team Status for {this.state.today}
            </b>
          </span>
          <LoaderButton
            bsStyle="info"
            bsSize="small"
            className="pullRight"
            isLoading={this.state.isDeleting}
            href={this.state.statusButtonPath}
            onClick={this.handleStatusClick}
            text={this.state.statusButtonLabel}
            loadingText="Deleting…" />
        </PageHeader>

        <ListGroup>
          { ! this.state.isLoading
            && this.renderUsersList(this.state.users) }
        </ListGroup>
      </div>
    );
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
}

export default withRouter(Home);