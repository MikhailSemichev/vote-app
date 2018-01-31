import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { topicsStore, votesStore } from '../../stores';
import { CandidatesList } from '../CandidatesList';

import './Vote.scss';

@withRouter
class Vote extends Component {
    state = {};

    componentDidMount() {
        this.loadTopic();
    }

    componentDidUpdate(prevProps) {
        if (this.getTopicId() !== prevProps.match.params.topicId) {
            this.loadTopic();
        }
    }

    componentWillUnmount() {
        this.closeSocket && this.closeSocket();
    }

    getTopicId() {
        return this.props.match.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();

        this.closeSocket && this.closeSocket();
        this.closeSocket = votesStore.onVote(topicId);

        const topic = await topicsStore.getTopic(topicId);
        votesStore.setCurrentTopic(topic);

        this.setState({
            topicId,
            topic: { ...topic }
        });
    }

    render() {
        const { topic } = this.state;
        return (
            <div className='app-page vote-page'>
                {topic && <div>
                    <h1>{topic.name}</h1>
                    <CandidatesList />
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default Vote;
