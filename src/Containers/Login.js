import React, { Component } from 'react';
import { Form, Button, Input, Icon, message } from 'antd';
import { withRouter } from 'react-router-dom';
import { auth, provider } from '../firebase'

const KEY_USER_DATA = 'user_data';

class Login extends Component {
  state = {
    email: '',
    password: '',
    user: null,
    size: 'large'
  };

  navigateToMainPage = () => {
    const { history } = this.props;
    history.push('/giphy');
  };

  componentDidMount() {
    const jsonStr = localStorage.getItem(KEY_USER_DATA);
    const isLoggedIn = jsonStr && JSON.parse(jsonStr).isLoggedIn;
    if (isLoggedIn) {
      this.navigateToMainPage();
    }
  }

  onEmailChange = event => {
    const email = event.target.value;
    this.setState({ email });
  };

  onPasswordChange = event => {
    const password = event.target.value;
    this.setState({ password });
  };

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validatePassword(password) {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;
    return re.test(String(password));
  }

  onSubmitFormLogin = e => {
    e.preventDefault();
    const isValid = this.validateEmail(this.state.email);
    const isValidePassword = this.validatePassword(this.state.password);
    if (isValid && isValidePassword) {
      localStorage.setItem(
        KEY_USER_DATA,
        JSON.stringify({
          isLoggedIn: true,
          email: this.state.email
        })
      );
      this.navigateToMainPage();
    } else {
      message.error('Email or Password invalid!', 1);
    }
  };

  loginFacebook = () => {
    auth.signInWithPopup(provider).then(({ user }) => {
        this.setState({ user })
        localStorage.setItem(
          KEY_USER_DATA,
          JSON.stringify({
            isLoggedIn: true,
            email:user.email
          })
        );
        this.props.history.replace("/giphy")
    })
  }
   

logoutFacebook = () => {
    auth.signOut().then(() => {
        this.setState({ user: null }) 
    })
}


  render() {
      const size = this.state.size;
    return (
      <div style={{ width: '30%', margin: '0 auto' }}>
        <h2>Login</h2>
        <Form onSubmit={this.onSubmitFormLogin}>
          <Form.Item>
            <Input
              prefix={<Icon type="user" />}
              placeholder="Email"
              onChange={this.onEmailChange}
            />
          </Form.Item>

          <Form.Item>
            <Input
              prefix={<Icon type="lock" />}
              type="password"
              placeholder="Password"
              onChange={this.onPasswordChange}
            />
          </Form.Item>

          <Form.Item>
            <Button htmlType="submit" type="primary">
              Submit
            </Button>
          </Form.Item>

          <Form.Item>
            <Button  type="primary" onClick={this.loginFacebook} icon="facebook" size={size}>
               Sign up with Facebook
            </Button>
          </Form.Item>

        </Form>
      </div>
    );
  }
}

export default withRouter(Login);
