import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { topicsStore, votesStore } from '../../stores';
import './Vote.scss';

@withRouter
@observer
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

    handleVote = (candidateName, isVote) => {
        votesStore.vote(this.getTopicId(), candidateName, isVote);
    };

    handleModalVisible = (candidate) => {
        votesStore.modalVisible = true;
        votesStore.selectedCandidate = candidate;
    }

    getTopicId() {
        return this.props.match.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();

        this.closeSocket && this.closeSocket();
        this.closeSocket = votesStore.onVote(topicId);

        const topic = await topicsStore.getTopic(topicId);
        votesStore.currentTopic = topic;

        this.setState({
            topicId,
            topic: { ...topic }
        });
    }

    render() {
        const { topic } = this.state;
        const candidatesInfo = votesStore.candidatesInfo;

        return (
            <div className='app-page vote-page'>
                {topic && <div>
                    <h1>{topic.name}</h1>
                    <div>
                        {candidatesInfo.map(c => (
                            <div
                                className={cn('candidate-item', { 'is-voted': c.isVoted })}
                                key={c.name}>
                                <div
                                    className='votes-count'>
                                    <div
                                        className='count'
                                        title={c.logins.join(' | ')}>
                                        {c.logins.length}
                                    </div>
                                </div>
                                <div className='candidate-name'>{c.name}</div>
                                {topic.isActive &&
                                    <i
                                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !c.isVoted, 'fa-thumbs-up': c.isVoted })}
                                        onClick={votesStore.isCategoriesPresented ? () => this.handleModalVisible(c) : () => this.handleVote(c.name, !c.isVoted)} />
                                }
                            </div>
                        ))}
                    </div>
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default Vote;
