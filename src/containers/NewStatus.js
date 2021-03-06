import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig, s3Upload } from '../libs/awsLib';
import {
  FormGroup,
  FormControl,
  ControlLabel,
  Glyphicon,
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
      statusId: null,
      userId: this.props.match.params.userId,
      title: '',
      userState: 'false',
      content: '',
      hasFileAttached: false,
    };
  }

  async componentDidMount() {
    if( this.props.userToken === undefined) {
      this.props.history.push('/login');
    } else {
      if( this.props.match.params && this.props.match.params.statusId ) {
        const statusId = this.props.match.params.statusId;
        try {
          const results = await this.getStatus(statusId);
          this.setState({
            statusId: statusId,
            content: results.content ? results.content : '',
            title: results.title,
            userState: results.userState,
          });
        } catch(e) {
          alert(e);
        }
      }
    }
  }

  // TODO: share, used in both Status.js and NewStatus.js (which should be renamed)
  getStatus(statusId) {
    return invokeApig({ path: `/statuses/${statusId}` }, this.props.userToken);
  }

  validateForm() {
    return this.state.title.length > 0;
  }

  handleChange = (event) => {
    var targetId = event.target.id;
    if(targetId === 'title' && event.target.value.length > 139) {
      alert("If you really need to say more, put it in details.");
      return false;
    }
    
    if(targetId === 'content' && event.target.value.length > 499) {
      alert("Keep it brief please, you're not at Toastmasters.");
      return false;
    }

    this.setState({ [event.target.id]: event.target.value });
  }
  
  handleUserState = (event) => {
    this.setState({ userState: event.target.value });
  }

  handleFileChange = (event) => {
    this.file = event.target.files[0];
    this.setState({hasFileAttached: true});
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
          userId: this.state.userId,
          title: this.state.title,
          content: this.state.content ? this.state.content : '',
          userState: this.state.userState,
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
          <input type="hidden" id="userId" value={this.props.match.params.userId} />
      
          <FormGroup controlId="title">
            <ControlLabel>Your status</ControlLabel>
            <FormControl
              autoFocus
              value={this.state.title}
              onChange={this.handleChange}
              maxLength={140}
              componentClass="textarea" />
            <div className="counter">
               {this.state.title.length}/140
            </div>
          </FormGroup>

          <FormGroup controlId="content">
            <ControlLabel>Further details, if you must</ControlLabel>
            <FormControl
              onChange={this.handleChange}
              value={this.state.content}
              maxLength={500}
              componentClass="textarea" />
            <div className="counter">
               {this.state.content.length}/500
            </div>
          </FormGroup>
              
          <div className="blocked">
            <ControlLabel>Blocked?&nbsp;&nbsp;&nbsp;</ControlLabel>
            
            
                <input type="radio" name="userState" 
                                   value="false"
                                   checked={this.state.userState === 'false'}
                                   onChange={this.handleUserState} />
                                   &nbsp;
                                   No
                                   &nbsp;&nbsp;&nbsp;
                <input type="radio" name="userState" 
                                   value="true"
                                   checked={this.state.userState === 'true'}
                                   onChange={this.handleUserState} />
                                   &nbsp;
                                   Yes
          </div>

          <FormGroup controlId="file">
            <ControlLabel>
              <div className='btn btn-default'>
                Attach file <Glyphicon glyph="paperclip" />
              </div>
            </ControlLabel>

            <FormControl
              onChange={this.handleFileChange}
              className="upload"
              type="file" />

            {
            this.state.hasFileAttached
              ?
              <label>&nbsp;&nbsp;{this.file.name}</label>
              : null
            }
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
