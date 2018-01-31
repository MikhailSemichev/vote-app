import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Switch } from 'antd';
import { observer } from 'mobx-react';

import { topicsStore, votesStore } from '../../stores';
import { CandidatesList } from '../CandidatesList';

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

    handleStatusChange = (isNeedToShowDetailedInformation) => {
        votesStore.isNeedToShowDetailedInformation = isNeedToShowDetailedInformation;
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
                    <div className='page-header'>
                        <h1>{topic.name}</h1>
                        {votesStore.isCategoriesPresented &&
                            <Switch
                                checked={votesStore.isNeedToShowDetailedInformation}
                                onChange={this.handleStatusChange}
                                checkedChildren='Hide detailed information'
                                unCheckedChildren='Show detailed information'/>
                        }
                    </div>
                    <CandidatesList />
                </div>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default Vote;
