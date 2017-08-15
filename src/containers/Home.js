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

    this.state = {
      today: this.getDateAsString(new Date()),
      isLoading: false,
      users: [],
      statusButtonPath: "/statuses/new",
      statusButtonLabel: "Add your status",
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const users = await this.users();
      this.setState({ users: users });

      if( users.length > 0 ) {
        users.some(function(user) {
          if( user.userName === this.props.userName) {
            if( this.state.today === this.getDateAsString(user.last_status_createdAt)) {
              this.setState({statusButtonPath: "/statuses/edit"});
              this.setState({statusButtonLabel: "Edit your status"});
            }
            return true;
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

  renderUsersList(users) {
    return users.map(function(user) {
      if (this.state.today === this.getDateAsString(user.last_status_createdAt)) {
        return this.renderToday(user);
      } else {
        return this.renderNotToday(user);
      }
    }, this);
  }
  
  renderToday(user) {
    return (
    <ListGroupItem
      key={user.userName}
      className='today'>
      <h4 className="list-group-item-heading">
        {user.name}&nbsp;&nbsp;
        <small>
          timestamp
        </small>
      </h4>
      <div>
        <a href={`/statuses/${user.last_status_id}`}>
          {user.last_status_title}
        </a>
        <p>
        <small>
          Show paperclip if there's an attachment.
          Maybe we don't even want a status page--instead a 'more' link to reveal the description, if there is one, and the attachement opens in a different window.
          Limit the number of characters allowed in both the summary and description, and be funny about it--this is a standup, damnit.
          Put a pencil edit icon next to your own status for that day, and get rid of the edit utton in the header (probably want to keep the 'add' one.)
        </small>
        </p>
      </div>

    </ListGroupItem>
    );
  }
  
  renderNotToday(user) {
    return (
      <ListGroupItem
        key={user.userName}
        className='not-today'>
        <h4 className="list-group-item-heading">
          {user.name}
        </h4>
        <div>
          <span className='status-date'>Last status: </span>
          <a href={`/statuses/${user.last_status_id}`}>
            {user.last_status_title}
          </a>
        </div>
      </ListGroupItem>
    );
  }

}

export default withRouter(Home);
