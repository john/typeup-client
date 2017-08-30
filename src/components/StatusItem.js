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
      className={(this.props.hasSubmittedStatus === 'true') ? 'today' : 'not-today'}>

      {
        (this.props.user.lastStatusAttachment)
          ?
        <Button className="pull-right" bsStyle="info" bsSize="small">
          <a href={this.props.user.lastStatusAttachment} target="_blank">
            <Glyphicon glyph="paperclip" />
          </a>
        </Button>
        : null
      }
      {
      (this.props.userName === this.getCurrentUser().username)
        ?
        (this.props.hasSubmittedStatus === 'true')
          ?
            <Button className="pull-right" bsStyle="info" bsSize="small">
              <a href={"/users/" + this.props.userId + "/statuses/" + this.props.user.lastStatusId + "/edit"}>
                Edit <Glyphicon glyph="pencil" />
              </a>
            </Button>
          :
            <Button className="pull-right" bsStyle="info" bsSize="small">
              <a href={"/users/" + this.props.userId + "/statuses/new"}>
                Add status for today <Glyphicon glyph="pencil" />
              </a>
            </Button>
        : null
      }
      <h4 className="list-group-item-heading">
        <a href={"/users/" + this.props.userId}>{this.props.userFullName}</a>&nbsp;&nbsp;
        <small>
        {
          (this.props.createdAt)
            ?
          <Moment format="YYYY/MM/DD"parse="YYYY-MM-DD">{this.props.createdAt}</Moment>
          : "Hasn't submitted a status yet."
        }
        </small>
      </h4>

      <div className="title">
        {this.props.title}
      </div>
      {
        this.props.content
          ?
        <More description={this.props.content} />
          : null
      }
    </ListGroupItem>
    );
  }
}

export default StatusItem;
