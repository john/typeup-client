import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig } from '../libs/awsLib';
import {
  FormGroup,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
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
    return invokeApig({ path: `/statuses/${this.props.match.params.id}` }, this.props.userToken);
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
          ( <form onSubmit={this.handleSubmit}>


            <FormGroup controlId="title">
              <ControlLabel>Summary</ControlLabel>
              <FormControl
                value={this.state.title}
                onChange={this.handleChange}
                componentClass="input" />
            </FormGroup>

            <div className="blocked">
              <b>Blocked?</b>&nbsp;&nbsp;&nbsp;
              <ToggleButtonGroup type="radio" name="userState">
                <ToggleButton value="no" className="blocked-button">
                  No
                </ToggleButton>
                <ToggleButton value="yes" className="blocked-button">
                  Yes
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            <FormGroup controlId="content">
              <ControlLabel>Description</ControlLabel>
              <FormControl
                onChange={this.handleChange}
                value={this.state.content}
                componentClass="textarea" />
            </FormGroup>

              { this.state.status.attachment && (
                <FormGroup>
                  <ControlLabel>Attachment</ControlLabel>
                  <FormControl.Static>
                    <a target="_blank" rel="noopener noreferrer" href={ this.state.status.attachment }>
                      { this.formatFilename(this.state.status.attachment) }
                    </a>
                  </FormControl.Static>
                </FormGroup>
              )}

              <FormGroup controlId="file">
                { ! this.state.status.attachment &&
                <ControlLabel>Attachment</ControlLabel> }
                <FormControl
                  onChange={this.handleFileChange}
                  type="file" />
              </FormGroup>

              <LoaderButton
                block
                bsStyle="primary"
                bsSize="large"
                disabled={ ! this.validateForm() }
                type="submit"
                isLoading={this.state.isLoading}
                text="Save"
                loadingText="Saving…" />

              <LoaderButton
                block
                bsStyle="danger"
                bsSize="large"
                isLoading={this.state.isDeleting}
                onClick={this.handleDelete}
                text="Delete"
                loadingText="Deleting…" />

            </form> )}
        </div>
      );
  }
}

export default withRouter(Status);
