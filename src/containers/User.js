import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
} from 'react-bootstrap';
import config from '../config.js';

class User extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      user: null,
      //title: '',
      //userState: '',
      //content: '',
    };
  }

  async componentDidMount() {
    if( this.props.userToken === undefined) {
      this.props.history.push('/login');
    } else {
      try {
        const results = await this.getUser();
        this.setState({
          user: results,
        });
      }
      catch(e) {
        alert(e);
      }
    }
  }

  // TODO: reshare, used in both Status.js and NewStatus.js (which should be renamed)
  getUser() {
    return invokeApig({ path: `/users/${this.props.match.params.userId}` }, this.props.userToken);
  }

  render() {
    return (
      <div className="User">
      { this.state.user &&
        ( <div>
          <PageHeader>
            <span>
              <b>
                {this.state.user.name}
              </b>
            </span>
          </PageHeader>
          </div>
        )
      }
      </div>
    );
  }
}

export default withRouter(User);
