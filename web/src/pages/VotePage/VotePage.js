import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { topicsStore, votesStore, loginStore } from '../../stores';
import { stableSort } from '../../utils/utils';
import './VotePage.scss';

import NewCandidate from './NewCandidate/NewCandidate';

@withRouter
@observer
class VotePage extends Component {
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

    handleAddNewCandidate = () => {
        this.loadTopic();
    }

    getTopicId() {
        return this.props.match.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();

        this.closeSocket && this.closeSocket();
        this.closeSocket = votesStore.onVote(topicId);

        const topic = await topicsStore.getTopic(topicId);

        this.setState({
            topicId,
            topic: { ...topic }
        });
    }

    render() {
        const { topic } = this.state;
        const { topicVotes } = votesStore;
        const { userInfo } = loginStore;
        let candidatesInfo = [];

        if (topic) {
            candidatesInfo = topic.candidates.map(c => {
                const logins = topicVotes
                    .filter(v => c.name === v.candidateName)
                    .map(v => v.login);

                return {
                    name: c.name,
                    isVoted: logins.includes(userInfo.login),
                    logins
                };
            });
            candidatesInfo = stableSort(candidatesInfo, (c1, c2) => {
                return c2.logins.length - c1.logins.length;
            });

            let place = 1;
            const TOP_PLACES = 3;
            let prevVotesCount;
            candidatesInfo = candidatesInfo.map(c => {
                if (place <= TOP_PLACES && c.logins.length) {
                    if (prevVotesCount && prevVotesCount !== c.logins.length) {
                        place++;
                    }
                    prevVotesCount = c.logins.length;
                    return {
                        ...c,
                        place
                    };
                }
                return c;
            });
        }

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
                                        className={cn('count', { [`place-${c.place}`]: c.place })}
                                        title={c.logins.join(' | ')}>
                                        {c.logins.length}
                                    </div>
                                </div>
                                <div className='candidate-name'>{c.name}</div>
                                {topic.isActive &&
                                    <i
                                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !c.isVoted, 'fa-thumbs-up': c.isVoted })}
                                        onClick={() => this.handleVote(c.name, !c.isVoted)} />
                                }
                            </div>
                        ))}
                    </div>
                    <NewCandidate
                        topic={topic}
                        onAddNewCandidate={this.handleAddNewCandidate} />
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default VotePage;
