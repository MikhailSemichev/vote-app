import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import cn from 'classnames';

import { topicsStore, votesStore, loginStore } from '../../stores';
import './VotePage.css';

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
        const { login } = loginStore;
        let candidatesInfo = [];

        if (topic) {
            candidatesInfo = topic.candidates.map(c => {
                const logins = topicVotes
                    .filter(v => c.name === v.candidateName)
                    .map(v => v.login);

                return {
                    name: c.name,
                    isVoted: logins.includes(login),
                    logins
                };
            });
            candidatesInfo.sort((c1, c2) => {
                return c2.logins.length - c1.logins.length;
            });
        }

        return (
            <div className='vote-page'>
                <div>
                    <Link to='/'>Back to Topics</Link>
                </div>

                {topic && <div>
                    <h1>{topic.name}</h1>
                    <div>
                        {candidatesInfo.map(c => (
                            <div
                                className={cn({ 'is-voted' : c.isVoted })}
                                key={c.name}>
                                <span>{c.name}</span>
                                <button
                                    className='vote-btn'
                                    onClick={() => this.handleVote(c.name, !c.isVoted)}>{c.isVoted ? 'Unvote' : 'Vote'}</button>
                                <span title={c.logins.join(' | ')}>{c.logins.length}</span>
                            </div>
                        ))}
                    </div>
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default VotePage;
