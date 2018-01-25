import React, { Component } from 'react';

import { topicsStore } from '../../../stores';

import './NewCandidate.scss';

class NewCandidate extends Component {
    state = {
        isAdding: false,
        candidateName: ''
    };

    handleAddingCandidate = () => {
        this.setState({ isAdding: true });
    }

    handleAddCandidate = async (e) => {
        e.preventDefault();

        try {
            const { topic, onAddNewCandidate } = this.props;
            const topicCandidates = topic.candidates.map(({ name }) => ({ name }));

            await topicsStore.saveTopic({
                ...topic,
                candidates: [...topicCandidates, { name: this.state.candidateName }]
            });
            this.clearForm();
            onAddNewCandidate();
        } catch (err) {
            // eslint-disable-next-line
            alert(err.response.data);
            this.clearForm();
        }
    }

    handleTextChange = e => {
        this.setState({
            candidateName: e.target.value
        });
    };

    clearForm() {
        this.setState({
            isAdding: false,
            candidateName: ''
        });
    }

    render() {
        const { isAdding, candidateName } = this.state;
        const { topic } = this.props;

        if (!topic) {
            return null;
        }

        return (
            <div className='new-candidate'>
                {topic && <div>
                    {!isAdding && <button onClick={this.handleAddingCandidate}>Add your candidate</button>}
                    {isAdding && <div>
                        <form onSubmit={this.handleAddCandidate}>
                            <textarea
                                value={candidateName}
                                onChange={this.handleTextChange} />
                            <button
                                className='save-btn'
                                disabled={!candidateName}>Save</button>
                        </form>
                    </div>}
                </div>}
            </div>
        );
    }
}

export default NewCandidate;
