import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { loginStore } from '../../stores';
import './LoginPage.scss';

@withRouter
@observer
class LoginPage extends Component {
    state = { showAdminPassword: false };

    handleSubmit = e => {
        e.preventDefault();
        loginStore.setLogin(
            this.loginRef.value,
            this.adminPasswordRef.value
        );

        const { from } = this.props.location.state || {
            from: { pathname: '/' }
        };
        this.props.history.push(from.pathname);
    };

    handleAdminPassword = e => {
        e.preventDefault();
        const isShow = !this.state.showAdminPassword;
        this.setState({
            showAdminPassword: isShow
        });
    };

    render() {
        const { userInfo } = loginStore;
        const { showAdminPassword } = this.state;
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
                        defaultValue={userInfo ? userInfo.login : ''}
                        placeholder='Please type your name as in UPSA...'
                        ref={r => this.loginRef = r} />
                    <div className='btn-container'>
                        <div className='admin-container'>
                            role:
                            <a
                                href='#'
                                onClick={this.handleAdminPassword}>
                                admin
                            </a>
                            <input
                                type='password'
                                className={cn('password-input', { 'hidden': !showAdminPassword })}
                                autoComplete='new-password'
                                defaultValue={userInfo ? userInfo.adminPassword : ''}
                                ref={r => this.adminPasswordRef = r} />
                        </div>
                        <button className='login-btn'>Login</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default LoginPage;
