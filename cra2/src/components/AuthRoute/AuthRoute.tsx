import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { loginStore } from '../../stores';

interface IProps {
    component: React.ComponentClass;
    exact?: boolean;
    path: string;
}

export default class AuthRoute extends React.Component<IProps> {
    renderRote = (props: any) => {
        const { component: Component } = this.props;
        return loginStore.isLoggedIn ? (
            <Component {...props} />
        ) : (
            <Redirect
                to={{
                    pathname: '/login',
                    state: { from: props.location },
                }}
            />
        );
    };

    render() {
        const { component, ...rest } = this.props;
        return <Route {...rest} render={this.renderRote} />;
    }
}
