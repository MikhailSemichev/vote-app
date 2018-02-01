import React, { Component } from 'react';
import { Switch } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import * as _ from 'lodash';

import { topicsStore } from '../../stores';
import './EditTopicPage.scss';

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
        if (this.getTopicId() !== prevProps.match.params.topicId) {
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
                    candidates: this.uniqFilterAndMapProperty(topic.candidatesText.split('\n'), 'name'),
                    categories: this.uniqFilterAndMapProperty(topic.categoriesText.split('\n'), 'title'),
                    isActive: topic.isActive
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

    handleStatusChange = isActive => {
        this.setState({
            topic: {
                ...this.state.topic,
                isActive
            }
        });
    }

    getTopicId() {
        return this.props.match.params.topicId;
    }

    uniqFilterAndMapProperty(array, propertyNameForMapping) {
        return _
            .uniq(array)
            .filter(value => value)
            .map(propertyValue => ({ [propertyNameForMapping]: propertyValue }));
    }

    async loadTopic() {
        const topicId = this.getTopicId();
        const topic = topicId ? await topicsStore.getTopic(topicId)
            : { name: '', isActive: true, candidates: [], categories: [] };

        topic.candidatesText = topic.candidates.map(candidate => candidate.name).join('\n');
        topic.categoriesText = topic.categories.map(category => category.title).join('\n');
        this.setState({
            topic: { ...topic },
            isSaving: false
        });
    }

    render() {
        const topicId = this.getTopicId();
        const { topic, isSaving } = this.state;

        return (
            <div className='app-page edit-topic-page'>
                <div className='page-header'>
                    <h1>{topicId ? 'Edit' : 'Create'} Topic Page</h1>
                    {topic &&
                        <Switch
                            checked={topic.isActive}
                            onChange={this.handleStatusChange}
                            checkedChildren='In progress'
                            unCheckedChildren='Closed' />
                    }
                </div>

                {topic && <form onSubmit={this.handleSubmit}>
                    <div className='field'>
                        <div className='field-label'>
                            <label htmlFor='topicName'>Topic Name</label>
                        </div>
                        <input
                            id='topicName'
                            name='name'
                            value={topic.name}
                            onChange={this.handleTextChange}
                            type='text' />
                    </div>
                    <div className='field'>
                        <div className='field-label'>
                            <label htmlFor='topicCandidates'>Topic Candidates</label>
                        </div>
                        <textarea
                            id='topicCandidates'
                            name='candidatesText'
                            onChange={this.handleTextChange}
                            rows='10'
                            value={topic.candidatesText}/>
                    </div>
                    <div className='field'>
                        <div className='field-label'>
                            <label htmlFor='votingCategories'>Voting categories</label>
                        </div>
                        <textarea
                            id='votingCategories'
                            name='categoriesText'
                            onChange={this.handleTextChange}
                            rows='5'
                            value={topic.categoriesText}
                            readOnly={topicId}/>
                    </div>
                    <div className='btn-container'>
                        <button
                            className='save-btn'
                            disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>}
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}

export default EditTopicPage;
