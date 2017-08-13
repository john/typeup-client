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
      statusButtonLabel: "Add status",
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
              this.setState({statusButtonLabel: "Edit status"});
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
    if( (typeof theDate) === 'string' ) {
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
      if (this.state.today == this.getDateAsString(user.last_status_createdAt)) {
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
      href={`/users/${user.name}`}
      onClick={this.handleStatusClick}
      className='today'
      header={user.name}>
      <div>
        {user.last_status_title}
      </div>
      <div className='status-date'>
        Today at *time*
      </div>
    </ListGroupItem>
    );
  }

  renderNotToday(user) {
    return (
      <ListGroupItem
        key={user.userName}
        href={`/users/${user.name}`}
        onClick={this.handleStatusClick}
        className='not-today'
        header={user.name}>
        <div>
          {user.last_status_title}
        </div>
        <div className='status-date'>
          {this.getDateAsString(user.last_status_createdAt)}
        </div>
      </ListGroupItem>
    );
  }

}

export default withRouter(Home);
