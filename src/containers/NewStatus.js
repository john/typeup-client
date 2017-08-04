import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig, s3Upload } from '../libs/awsLib';
import {
  FormGroup,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
  ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import config from '../config.js';
import './NewStatus.css';

class NewStatus extends Component {
  constructor(props) {
    super(props);

    this.file = null;

    this.state = {
      isLoading: null,
      title: '',
      blocked: '',
      content: '',
    };
  }

  validateForm() {
    return this.state.title.length > 0;
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

    try {
      const uploadedFilename = (this.file)
        ? (await s3Upload(this.file, this.props.userToken)).Location
        : null;

      await this.createStatus({
        title: this.state.title,
        content: this.state.content,
        attachment: uploadedFilename,
      });
      this.props.history.push('/');
    }
    catch(e) {
      alert(e);
      this.setState({ isLoading: false });
    }

  }

  createStatus(status) {
    console.log('userToken in createNote is: ' + this.props.userToken);
    
    return invokeApig({
      path: '/statuses',
      method: 'POST',
      body: status,
    }, this.props.userToken);
  }

  render() {
    return (
      <div className="NewStatus">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="title">
            Headline:
            <FormControl
              onChange={this.handleChange}
              value={this.state.title}
              componentClass="text" />
          </FormGroup>
              Blocked?&nbsp;&nbsp;&nbsp; 
          <ToggleButtonGroup type="radio" name="blocked">
            <ToggleButton value={0} className="blocked-button">
              No
            </ToggleButton>
            <ToggleButton value={1} className="blocked-button">
              Yes
            </ToggleButton>
          </ToggleButtonGroup>
          <FormGroup controlId="content">
            Details:
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              componentClass="textarea" />
          </FormGroup>
          <FormGroup controlId="file">
            <ControlLabel>Attachment</ControlLabel>
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
            text="Create"
            loadingText="Creating…" />
        </form>
      </div>
    );
  }
}

export default withRouter(NewStatus);