import React, { Component } from 'react';
import { Switch } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { observer } from 'mobx-react';

import { uniqStrings } from '../../utils/utils';

import { topicsStore } from '../../stores';
import './EditTopicPage.scss';
import { ITopic, ICandidate } from '../../types/interfaces';

interface IRouteProps {
    topicId: string;
}

interface IProps extends RouteComponentProps<IRouteProps> {}

interface IState {
    topic: ITopicFormFields | null;
    isSaving: boolean;
}

interface ITopicFormFields extends ITopic {
    candidatesText: string;
}

@(withRouter as any)
@observer
export default class EditTopicPage extends Component<IProps> {
    state: IState = {
        topic: null,
        isSaving: false,
    };

    componentDidMount() {
        this.loadTopic();
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.getTopicId() !== prevProps.match.params.topicId) {
            this.loadTopic();
        }
    }

    handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!this.state.isSaving && this.state.topic) {
            const {
                _id,
                id,
                name,
                candidatesText,
                isActive,
                isAllowAddCandidates,
            } = this.state.topic;

            console.log(name);

            this.setState({ isSaving: true });
            try {
                await topicsStore.saveTopic({
                    id,
                    _id,
                    name,
                    candidates: uniqStrings(candidatesText.split('\n'))
                        .filter(n => n)
                        .map(n => ({ name: n })),
                    isActive,
                    isAllowAddCandidates,
                });
                this.props.history.push('/');
            } catch (err) {
                alert(err.response.data);
                this.setState({ isSaving: false });
            }
        }
    };

    handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        this.handleValueChange(name as keyof ITopicFormFields, value);
    };

    handleStatusChange = (isChecked: boolean) => {
        this.handleValueChange('isActive', isChecked);
    };

    handleAllowAddCandidatesChange = (isChecked: boolean) => {
        this.handleValueChange('isAllowAddCandidates', isChecked);
    };

    handleValueChange = (
        name: keyof ITopicFormFields,
        value: string | boolean,
    ) => {
        const topic: ITopicFormFields = {
            ...this.state.topic!,
            [name]: value,
        };
        this.setState({ topic });
    };

    getTopicId() {
        return this.props.match.params.topicId;
    }

    async loadTopic() {
        const topicId = this.getTopicId();
        const topic: ITopicFormFields = topicId
            ? ((await topicsStore.getTopic(topicId)) as ITopicFormFields)
            : {
                  name: '',
                  isActive: true,
                  isAllowAddCandidates: true,
                  candidates: [],
                  candidatesText: '',
              };

        topic.candidatesText = topic
            .candidates!.map((c: ICandidate) => c.name)
            .join('\n');
        this.setState({
            topic: { ...topic },
            isSaving: false,
        });
    }

    render() {
        const topicId = this.getTopicId();
        const { topic, isSaving } = this.state;

        return (
            <div className="app-page edit-topic-page">
                <form onSubmit={this.handleSubmit}>
                    <div className="page-header">
                        <h1>{topicId ? 'Edit' : 'Create'} Topic Page</h1>
                        <button className="save-btn" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>

                    {topic && (
                        <div>
                            <div className="field">
                                <div className="field-label">
                                    <label htmlFor="topicName">
                                        Topic Name
                                    </label>
                                </div>
                                <input
                                    id="topicName"
                                    name="name"
                                    value={topic.name}
                                    onChange={this.handleTextChange}
                                    type="text"
                                />
                            </div>

                            <div className="field">
                                <div className="field-label">
                                    <label htmlFor="topicCandidates">
                                        Topic Candidates
                                    </label>
                                </div>
                                <textarea
                                    id="topicCandidates"
                                    name="candidatesText"
                                    onChange={this.handleTextChange}
                                    rows={10}
                                    value={topic.candidatesText}
                                />
                            </div>

                            <div className="field">
                                <label>Topic Status:</label>
                                <Switch
                                    checked={topic.isActive}
                                    onChange={this.handleStatusChange}
                                    checkedChildren="In progress"
                                    unCheckedChildren="Closed"
                                />
                            </div>
                            <div className="field">
                                <label>Allow Add Candidates:</label>
                                <Switch
                                    checked={topic.isAllowAddCandidates}
                                    onChange={
                                        this.handleAllowAddCandidatesChange
                                    }
                                    checkedChildren="Yes"
                                    unCheckedChildren="No"
                                />
                            </div>

                            <div className="btn-container">
                                <button
                                    className="save-btn"
                                    disabled={isSaving}
                                >
                                    {isSaving ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
                {!topic && <div>Loading...</div>}
            </div>
        );
    }
}
