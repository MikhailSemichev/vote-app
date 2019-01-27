import * as React from 'react';
import { Router, Switch, Route, Redirect } from 'react-router-dom';

import history from './utils/history';

import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';

import './App.scss';

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div className="app">
                    <Header />
                    <Switch>
                        <Route path="/login" component={LoginPage} />
                        <Redirect to="/login" />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;

/*
import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import 'antd/dist/antd.css';
import './App.scss';

import AuthRoute from './components/AuthRoute/AuthRoute';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';
import TopicListPage from './pages/TopicListPage/TopicListPage';
import EditTopicPage from './pages/EditTopicPage/EditTopicPage';
import VotePage from './pages/VotePage/VotePage';

class App extends Component {
    render() {
        return (
            <HashRouter>
                <div className='app'>
                    <Header/>
                    <Switch>
                        <Route path='/login' component={LoginPage}/>
                        <AuthRoute exact path='/' component={TopicListPage}/>
                        <AuthRoute path='/topic/:topicId?' component={EditTopicPage} />
                        <AuthRoute path='/vote/:topicId' component={VotePage} />
                    </Switch>
                </div>
            </HashRouter>
        );
    }
}

export default App;

*/
