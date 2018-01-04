import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import * as _ from 'lodash';

import { topicsStore } from '../../stores';
import './EditTopicPage.css';

@withRouter
@observer
class EditTopicPage extends Component {
    state = {
        topic: null
    };

    componentDidMount() {
        this.loadTopic();
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.topicId !== prevProps.match.params.topicId) {
            this.loadTopic();
        }
    }

    handleSubmit = async e => {
        e.preventDefault();
        if (!this.state.isSaving) {
            const { topic } = this.state;
            this.setState({ isSaving: true });

            try {
                await topicsStore.saveTopic({
                    id: topic.id,
                    _id: topic._id,
                    name: topic.name,
                    candidates: _.uniq(topic.candidatesText.split('\n'))
                        .filter(name => name)
                        .map(name => ({ name }))
                });
                this.props.history.push('/');
            } catch (err) {
                // eslint-disable-next-line
                alert(err.response.data);
                this.setState({ isSaving: false });
            }
        }
    };

    handleTextChange = e => {
        const { name, value } = e.target;

        this.setState({
            topic: {
                ...this.state.topic,
                [name]: value
            }
        });
    };

    async loadTopic() {
        const { topicId } = this.props.match.params;
        const topic = topicId ? await topicsStore.getTopic(topicId)
            : { candidates: [] };

        topic.candidatesText = topic.candidates.map(c => c.name).join('\n');
        this.setState({
            topicId,
            topic: { ...topic },
            isSaving: false
        });
    }

    render() {
        const { topicId, topic, isSaving } = this.state;
        return (
            <div className='edit-topic-page'>
                <h1>{topicId ? 'Edit' : 'Create'} Topic Page</h1>
                {topic && <form onSubmit={this.handleSubmit}>
                    <div>
                        <label htmlFor='topicName'>Topic Name</label>
                        <input
                            id='topicName'
                            name='name'
                            value={topic.name}
                            onChange={this.handleTextChange}
                            type='text' />
                    </div>
                    <div>
                        <label htmlFor='topicCandidates'>Topic Candidates</label>
                        <textarea
                            id='topicCandidates'
                            name='candidatesText'
                            onChange={this.handleTextChange}
                            rows='10'
                            value={topic.candidatesText} />
                    </div>
                    <button disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                    </button>
                </form>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default EditTopicPage;
