import * as React from 'react';
import { observer } from 'mobx-react';
import history from '../../utils/history';

import { loginStore } from '../../stores';
import './Header.scss';

@observer
export default class Header extends React.Component {
    handleLogOff = () => {
        loginStore.logOff();
        history.push('/login');
    };

    handleAppNameClick = () => {
        history.push('/');
    };

    render() {
        const { userInfo } = loginStore;
        return (
            <div className="header">
                <div
                    className="header-app-name"
                    onClick={this.handleAppNameClick}
                >
                    Vote App
                </div>
                {userInfo && (
                    <div className="header-login">
                        <i className="fa fa-user-circle-o" />
                        <div className="header-login-text">
                            {userInfo.login}
                        </div>
                        <i
                            className="fa fa-sign-out"
                            title="Log off"
                            onClick={this.handleLogOff}
                        />
                    </div>
                )}
            </div>
        );
    }
}
