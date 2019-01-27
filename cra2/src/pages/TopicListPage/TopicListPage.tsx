import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { ITopic } from '../../types/interfaces';
import history from '../../utils/history';
import { topicsStore } from '../../stores';

import TopicItem from './TopicItem';

import './TopicListPage.scss';

@observer
export default class TopicListPage extends Component {
    componentWillMount() {
        topicsStore.loadTopics();
    }

    handleNewTopic = () => {
        history.push('/topic');
    };

    handleDelete = (topic: ITopic) => {
        // eslint-disable-next-line
        if (window.confirm(`Delete "${topic.name}"?`)) {
            topicsStore.deleteTopic(topic.id);
        }
    };

    render() {
        const { topics, isLoadingTopics } = topicsStore;
        const isEmpty = !isLoadingTopics && !topics.length;

        return (
            <div className="app-page topic-list-page">
                <div className="page-title">
                    <h1>Topics to Vote</h1>
                    <button onClick={this.handleNewTopic}>New Topic</button>
                </div>
                <div>
                    {isLoadingTopics && 'Loading...'}
                    {isEmpty && 'No topics. Yet :)'}
                    {topics &&
                        topics.map(topic => (
                            <TopicItem
                                key={topic.id}
                                topic={topic}
                                handleDelete={this.handleDelete}
                            />
                        ))}
                </div>
            </div>
        );
    }
}
