import React, { Component } from 'react';
import { Modal } from 'antd';

const KEY_USER_DATA = 'user_data';

class Profile extends Component {
  state = {
    email: '',
    isShowDialog: false
  };

  componentDidMount() {
    const jsonStr = localStorage.getItem(KEY_USER_DATA);
    this.setState({ email: JSON.parse(jsonStr).email });
  }

  render() {
    return (
      <div>
        <h1>Email: {this.state.email}</h1>
      </div>
    );
  }
}

export default Profile;
