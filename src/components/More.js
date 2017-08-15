import React, { Component } from 'react';

class More extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      description: this.props.description,
      showDescription: false,
    };
  }
  
  toggle() {
    this.setState({showDescription: !this.state.showDescription});
  }
  
  render() {
    return (
      <div className="more">
      
      {
      this.state.showDescription
        ?
          <div>
          <p className="description">
            <small>
            {this.state.description}
            </small>
          </p>
          <span className="small" onClick={() => this.toggle()}>less</span>
          </div>
        :
          <span className="small" onClick={() => this.toggle()}>more</span>
      }
      </div>
    );
  }
}

export default More;
