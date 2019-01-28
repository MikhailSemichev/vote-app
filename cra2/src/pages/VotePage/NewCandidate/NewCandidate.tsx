import React, { Component } from 'react';
import { uniqStrings } from '../../../utils/utils';

import { topicsStore } from '../../../stores';
import { ITopic } from '../../../types/interfaces';

import './NewCandidate.scss';

interface IProps {
    topic: ITopic;
}

class NewCandidate extends Component<IProps> {
    state = {
        isAdding: false,
        candidatesText: '',
    };

    handleAddingCandidate = () => {
        this.setState({ isAdding: true });
    };

    handleAddCandidate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const { topic } = this.props;
        const newCandidates = uniqStrings(
            this.state.candidatesText
                .split('\n')
                .map(name => name.trim())
                .filter(name => name),
        );

        this.clearForm();
        topicsStore.addCandidates(topic.id!, newCandidates);
    };

    handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({
            candidatesText: e.target.value,
        });
    };

    clearForm() {
        this.setState({
            isAdding: false,
            candidatesText: '',
        });
    }

    render() {
        const { isAdding, candidatesText } = this.state;
        const { topic } = this.props;

        if (!topic) {
            return null;
        }

        return (
            <div className="new-candidate">
                {topic && (
                    <div>
                        {!isAdding && (
                            <button onClick={this.handleAddingCandidate}>
                                Add your candidate
                            </button>
                        )}
                        {isAdding && (
                            <div>
                                <form onSubmit={this.handleAddCandidate}>
                                    <textarea
                                        value={candidatesText}
                                        onChange={this.handleTextChange}
                                    />
                                    <button
                                        className="save-btn"
                                        disabled={!candidatesText}
                                    >
                                        Save
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}

export default NewCandidate;
