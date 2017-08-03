import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
  ListGroup,
  ListGroupItem,
} from 'react-bootstrap';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      statuses: [],
    };
  }
  
  async componentDidMount() {
    if (this.props.userToken === null) {
      return;
    }

    this.setState({ isLoading: true });

    try {
      const results = await this.statuses();
      this.setState({ statuses: results });
    }
    catch(e) {
      alert(e);
    }

    this.setState({ isLoading: false });
  }

  statuses() {
    return invokeApig({ path: '/statuses' }, this.props.userToken);
  }

  renderStatusesList(statuses) {
    return [{}].concat(statuses).map((stat, i) => (
      i !== 0
        ? ( <ListGroupItem
              key={stat.statusId}
              href={`/statuses/${stat.statusId}`}
              onClick={this.handleStatusClick}
              header={stat.content.trim().split('\n')[0]}>
                { "Created: " + (new Date(stat.createdAt)).toLocaleString() }
            </ListGroupItem> )
        : ( <ListGroupItem
              key="new"
              href="/statuses/new"
              onClick={this.handleStatusClick}>
                <h4><b>{'\uFF0B'}</b> Create a new status</h4>
            </ListGroupItem> )
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
        <p>Don't Get Up. TypeUp!</p>
      </div>
    );
  }

  renderStatuses() {
    return (
      <div className="statuses">
        <PageHeader>Team Status</PageHeader>
        <ListGroup>
          { ! this.state.isLoading
            && this.renderStatusesList(this.state.statuses) }
        </ListGroup>
      </div>
    );
  }

  render() {
    return (
      <div className="Home">
        { this.props.userToken === null
          ? this.renderLander()
          : this.renderStatuses() }
      </div>
    );
  }
}

export default withRouter(Home);