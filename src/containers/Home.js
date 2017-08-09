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
      isLoading: false,
      statuses: [],
      users: [],
    };
  }

  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      // const results = await this.statuses();
      // this.setState({ statuses: results });
      const results = await this.users();
      this.setState({ users: results });
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  // statuses() {
  //   return invokeApig({ path: '/statuses' }, this.props.userToken);
  // }

  statuses() {
    return invokeApig({ path: '/users' }, this.props.userToken);
  }

  // This should return a list of users, with either the status summary of each, or an indication they haven't submitted it yet.
  renderStatusesList(statuses) {
    return statuses.map((stat) => (
      <ListGroupItem
        key={stat.statusId}
        href={`/statuses/${stat.statusId}`}
        onClick={this.handleStatusClick}
        header={stat.title.trim().split('\n')[0]}>
          { "Created: " + (new Date(stat.createdAt)).toLocaleString() }
      </ListGroupItem>
    ));
  }

  handleStatusClick = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  renderLander() {
    return (
      <div className="lander">
        <h1>TypeUp</h1>
        <p>Dont Get Up. TypeUp!</p>
      </div>
    );
  }

  renderStatuses() {
    return (
      <div className="statuses">
        <div>
          <span>
            <b>
              Team Status for [date]
            </b>
          </span>
          <LoaderButton
            bsStyle="info"
            bsSize="small"
            className="pullRight"
            isLoading={this.state.isDeleting}
            href="/statuses/new"
            onClick={this.handleStatusClick}
            text="Add status"
            loadingText="Deleting…" />
        </div>

        <ListGroup>
          { ! this.state.isLoading
            && this.renderUsersList(this.state.users) }
        </ListGroup>
      </div>
    );
  }

  // renderStatuses() {
  //   return (
  //     <div className="statuses">
  //       <div>
  //         <span>
  //           <b>
  //             Team Status for [date]
  //           </b>
  //         </span>
  //         <LoaderButton
  //           bsStyle="info"
  //           bsSize="small"
  //           className="pullRight"
  //           isLoading={this.state.isDeleting}
  //           href="/statuses/new"
  //           onClick={this.handleStatusClick}
  //           text="Add status"
  //           loadingText="Deleting…" />
  //       </div>
  //
  //       <ListGroup>
  //         { ! this.state.isLoading
  //           && this.renderStatusesList(this.state.statuses) }
  //       </ListGroup>
  //     </div>
  //   );
  // }

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