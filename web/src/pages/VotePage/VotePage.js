import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { Modal } from 'antd';

import { topicsStore, votesStore, loginStore } from '../../stores';
import { stableSort } from '../../utils/utils';
import './VotePage.scss';

@withRouter
@observer
class VotePage extends Component {
    constructor(props) {
        super(props);
        this.state = { modalVisible: false, selectedCandidate: null };
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

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

    // handleModalOk(e) { }
    handleModalCancel(e) {
        this.setState({ modalVisible:false });
    }

    handleShowModal(name) {
        this.setState({ modalVisible:true, selectedCandidate: name });
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
                                        className='count'
                                        title={c.logins.join(' | ')}>
                                        {c.logins.length}
                                    </div>
                                </div>
                                <div className='candidate-name'>{c.name}</div>
                                {topic.isActive &&
                                    <i
                                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !c.isVoted, 'fa-thumbs-up': c.isVoted })}
                                        onClick={() => this.handleShowModal(c.name)} />// () => this.handleVote(c.name, !c.isVoted)
                                }
                            </div>
                        ))}
                        <Modal
                            title={`Vote for ${this.state.selectedCandidate}`}
                            visible={this.state.modalVisible}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}>
                            <p>Please select categories for your vote</p>
                        </Modal>
                    </div>
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default VotePage;
