import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { loginStore } from '../../stores';

const AuthRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props => {
            return loginStore.isLoggedIn ? (
                <Component {...props} />
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            );
        }} />
);

export default AuthRoute;

