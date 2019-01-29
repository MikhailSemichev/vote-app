import * as React from 'react';
import { Router, Switch, Route } from 'react-router-dom';

import history from './utils/history';

import AuthRoute from './components/AuthRoute/AuthRoute';
import Header from './components/Header/Header';
import LoginPage from './pages/LoginPage/LoginPage';
import TopicListPage from './pages/TopicListPage/TopicListPage';
import EditTopicPage from './pages/EditTopicPage/EditTopicPage';
import VotePage from './pages/VotePage/VotePage';

// tslint:disable-next-line
import 'antd/dist/antd.css';
import './App.scss';

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <div className="app">
                    <Header />
                    <Switch>
                        <Switch>
                            <Route path="/login" component={LoginPage} />
                            <AuthRoute
                                exact={true}
                                path="/"
                                component={TopicListPage}
                            />
                            <AuthRoute
                                path="/topic/:topicId?"
                                component={EditTopicPage}
                            />
                            <AuthRoute
                                path="/vote/:topicId"
                                component={VotePage}
                            />
                        </Switch>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
