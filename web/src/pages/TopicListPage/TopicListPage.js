import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { topicsStore } from '../../stores';
import './TopicListPage.scss';

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
                <div className='btn-container'>
                    <button onClick={this.handleNewTopic}>New Topic</button>
                </div>
                <div>
                    {isLoading && 'Loading...'}
                    {isEmpty && 'No topics. Yet :)'}
                    {topics && topics.map(topic => (
                        <div
                            key={topic.id}
                            className='topic-item'>
                            <Link
                                className='topic-item-name'
                                to={`/vote/${topic.id}`}>
                                {topic.name}
                            </Link>
                            <Link
                                to={`/topic/${topic.id}`}
                                title='Edit Topic'>
                                <i className='fa fa-pencil-square-o'/>
                            </Link>
                            <a
                                href='#'
                                onClick={() => this.handleDelete(topic)}
                                title='Delete Topic'>
                                <i className='fa fa-times' />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default TopicListPage;
