import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { loginStore } from '../../stores';
import './LoginPage.scss';

@withRouter
@observer
class LoginPage extends Component {
    handleSubmit = e => {
        e.preventDefault();
        loginStore.setLogin(this.loginRef.value);

        const { from } = this.props.location.state || { from: { pathname: '/' } };
        this.props.history.push(from.pathname);
    };

    render() {
        const { login } = loginStore;
        return (
            <div className='app-page login-page'>
                <div className='page-title'>
                    <h1>Login Page</h1>
                    <p>Vote App is application for voting</p>
                </div>
                <form
                    className='login-form'
                    onSubmit={this.handleSubmit}>
                    <input
                        type='text'
                        defaultValue={login}
                        placeholder='Please type your login...'
                        ref={r => this.loginRef = r} />
                    <div className='btn-container'>
                        <button className='login-btn'>Login</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;
