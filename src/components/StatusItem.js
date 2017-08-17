import React, { Component } from 'react';
import {
  ListGroupItem,
  Button,
  Glyphicon, } from 'react-bootstrap';
import Moment from 'react-moment';
import { CognitoUserPool, } from 'amazon-cognito-identity-js';
import config from '../config.js';
import 'moment-timezone';
import More from './More';

class StatusItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDescription: false,
    };
  }

  toggle() {
    this.setState({showDescription: !this.state.showDescription});
  }

  getCurrentUser() {
    const userPool = new CognitoUserPool({
      UserPoolId: config.cognito.USER_POOL_ID,
      ClientId: config.cognito.APP_CLIENT_ID
    });
    return userPool.getCurrentUser();
  }

  render(user) {
    return (
    <ListGroupItem
      className={(this.props.today === 'true') ? 'today' : 'not-today'}>
      <h4 className="list-group-item-heading">
        {this.props.user.name}&nbsp;&nbsp;
        <small>
        <Moment format="YYYY/MM/DD"parse="YYYY-MM-DD">{this.props.user.last_status_createdAt}</Moment>
        </small>
      </h4>
      {
        (this.props.user.last_status_attachment)
          ?
        <Button className="pull-right" bsStyle="info" bsSize="small">
          <a href={this.props.user.last_status_attachment} target="_blank">
            <Glyphicon glyph="paperclip" />
          </a>
        </Button>
        : null
      }
      <div className="title">
        {this.props.user.last_status_title}
      </div>
      {
      ((this.props.user.userName === this.getCurrentUser().username) && (this.props.today === true))
          ?
        <Button className="pull-right" bsStyle="info" bsSize="small">
          <a href={this.props.user.last_status_attachment} target="_blank">
            <Glyphicon glyph="pencil" />
          </a>
        </Button>
        : null
      }
      {
        this.props.user.last_status_content
          ?
        <More description={this.props.user.last_status_content} />
          : null
      }
    </ListGroupItem>
    );
  }
}

export default StatusItem;
