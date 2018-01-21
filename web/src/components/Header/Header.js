import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { loginStore } from '../../stores';
import './Header.scss';

@withRouter
@observer
class Header extends Component {
    handleLogOff = e => {
        e.preventDefault();
        loginStore.logOff();
        this.props.history.push('/login');
    };

    handleAppNameClick = () => {
        this.props.history.push('/');
    };

    render() {
        const { userInfo } = loginStore;
        return (
            <div className='header'>
                <div
                    className='header-app-name'
                    onClick={this.handleAppNameClick}>
                    Vote App
                </div>
                {userInfo && <div className='header-login'>
                    <i className='fa fa-user-circle-o' />
                    <div className='header-login-text'>
                        {userInfo.login}
                    </div>
                    <i
                        className='fa fa-sign-out'
                        title='Log off'
                        onClick={this.handleLogOff} />
                </div>}
            </div>
        );
    }
}

export default Header;
