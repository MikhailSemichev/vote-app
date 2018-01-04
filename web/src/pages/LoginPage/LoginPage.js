import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { loginStore } from '../../stores';
import './LoginPage.css';

@withRouter
@observer
class LoginPage extends Component {
    handleSubmit = e => {
        e.preventDefault();
        loginStore.setLogin(this.loginRef.value);
        this.props.history.push('/');
    };

    render() {
        const { login } = loginStore;
        return (
            <div className='login-page'>
                <h1>Login Page</h1>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        defaultValue={login}
                        ref={r => this.loginRef = r} />
                    <button>Login</button>
                </form>
            </div>
        );
    }
}

export default LoginPage;
