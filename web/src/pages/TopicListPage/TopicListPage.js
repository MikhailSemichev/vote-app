import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { topicsStore } from '../../stores';
import './TopicListPage.css';

@withRouter
@observer
class TopicListPage extends Component {
    componentWillMount() {
        topicsStore.loadTopics();
    }

    handleNewTopic = e => {
        this.props.history.push('/topic');
    }

    handleDelete = topic => {
        // eslint-disable-next-line
        if (window.confirm(`Delete "${topic.name}"?`)) {
            topicsStore.deleteTopic(topic.id);
        }
    }

    render() {
        const { topics } = topicsStore;
        const isLoading = topics === null;
        const isEmpty =  topics && !topics.length;

        return (
            <div className='topic-list-page'>
                <button onClick={this.handleNewTopic}>New Topic</button>
                <div>
                    {isLoading && 'Loading...'}
                    {isEmpty && 'No topics. Yet :)'}
                    {topics && topics.map(topic => (
                        <div key={topic.id}>
                            <span>{topic.name}</span>
                            <Link to={`/vote/${topic.id}`}>Vote</Link>
                            <Link to={`/topic/${topic.id}`}>Edit</Link>
                            <a href='#' onClick={() => this.handleDelete(topic)}>Delete</a>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TopicListPage;
