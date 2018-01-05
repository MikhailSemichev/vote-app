import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { loginStore } from '../../stores';
import './Header.css';

@withRouter
@observer
class Header extends Component {
    handleLogOff = e => {
        e.preventDefault();
        loginStore.logOff();
        this.props.history.push('/login');
    };

    render() {
        const { login } = loginStore;
        return (
            <div className='header'>
                <div className='header-app-name'>Vote App</div>
                {login && <div className='header-login'>
                    <i className='fa fa-user-circle-o' />
                    <div className='header-login-text'>
                        {login}
                    </div>
                    <i
                        className='fa fa-sign-out'
                        title='Sign out'
                        onClick={this.handleLogOff} />
                </div>}
            </div>
        );
    }
}

export default Header;
