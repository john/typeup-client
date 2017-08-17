import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import {
  PageHeader,
} from 'react-bootstrap';
import config from '../config.js';
import './Status.css';

class Status extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      isDeleting: null,
      status: null,
      title: '',
      userState: '',
      content: '',
    };
  }

  async componentDidMount() {
    if( this.props.userToken === undefined) {
      this.props.history.push('/login');
    } else {
      try {
        const results = await this.getStatus();
        this.setState({
          status: results,
          content: results.content,
          title: results.title,
          userState: results.userState,
        });
      }
      catch(e) {
        alert(e);
      }
    }
  }

  getStatus() {
    return invokeApig({ path: `/statuses/${this.props.match.params.statusId}` }, this.props.userToken);
  }

  validateForm() {
    return this.state.title.length > 0;
  }

  formatFilename(str) {
    return (str.length < 50)
      ? str
      : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    if (this.file && this.file.size > config.MAX_ATTACHMENT_SIZE) {
      alert('Please pick a file smaller than 5MB');
      return;
    }

    this.setState({ isLoading: true });
  }

  handleDelete = async (event) => {
    event.preventDefault();

    const confirmed = window.confirm('Are you sure you want to delete this status?');

    if ( ! confirmed ) {
      return;
    }

    this.setState({ isDeleting: true });
  }

  render() {
    return (
      <div className="Status">
        { this.state.status &&
          ( <div>
            <PageHeader>
              <span>
                <b>
                  Status for {this.state.status.createdAt}
                </b>
              </span>
            </PageHeader>

            <label>
              Summary
            </label>
            <div>
              {this.state.title}
            </div>
            
            <label>
              Blocked?
            </label>
            <div>
              TK
            </div>
            
            <label>
              Description
            </label>
            <p>
              {this.state.content}
            </p>

            { this.state.status.attachment && (
              <div>
                <a target="_blank" rel="noopener noreferrer" href={ this.state.status.attachment }>
                  { this.formatFilename(this.state.status.attachment) }
                </a>
              </div>
            )}

            </div>

            )}
        </div>
      );
  }
}

export default withRouter(Status);
