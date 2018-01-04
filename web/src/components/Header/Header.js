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
                <div className='header-logo'>Logo!</div>
                <div className='header-login'>
                    <span>{login}</span>
                    <a
                        href='#'
                        onClick={this.handleLogOff}>Log off</a>
                </div>
            </div>
        );
    }
}

export default Header;
