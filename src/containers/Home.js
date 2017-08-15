import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Moment from 'react-moment';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import StatusItem from '../components/StatusItem';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      today: this.getDateAsString(new Date()),
      isLoading: false,
      users: [],
      hasStatusToday: false,
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
          if( user.userName === this.props.userName && user.last_status_title ) {
            this.setState({hasStatusToday: true});
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
      
          {
          ! this.state.hasStatusToday
            ?
            <LoaderButton
            bsStyle="info"
            bsSize="small"
            className="pullRight"
            isLoading={this.state.isDeleting}
            href="/statuses/new"
            onClick={this.handleStatusClick}
            text="Add your status" />
            : null
          }
          
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
      <StatusItem user={user} key={user.userName} />
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
