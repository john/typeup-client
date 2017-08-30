import React, { Component } from 'react';
import { invokeApig } from '../libs/awsLib';

class UserStatuses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      statuses: null,
    };
  }

  async componentDidMount() {
    if( this.props.userToken === undefined) {
      this.props.history.push('/login');
    } else {
      try {
        const results = await this.getStatuses();
        this.setState({
          statuses: results,
        });
      }
      catch(e) {
        alert(e);
      }
    }
  }

  getStatuses() {
    return invokeApig({ path: `/users/${this.props.user.userId}/statuses` }, this.props.userToken);
  }

  render(user) {
    return (
      <div>
      foo
      </div>
    )
  }
}

export default UserStatuses;