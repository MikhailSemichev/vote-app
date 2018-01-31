import React from 'react';
import { Modal } from 'antd';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

import { votesStore } from '../../stores';

import './VoteModal.scss';

@withRouter
@observer
class VoteModal extends React.Component {
    handleModalCancel = (e) => {
        votesStore.modalVisible = false;
    }

    handleModalOk = (e) => {
        if (votesStore.isAllowedToVote) {
            const topicId = this.props.match.params.topicId;
            votesStore.vote(topicId, votesStore.selectedCandidate.name);
            votesStore.modalVisible = false;
        }
    }

    handleInputChange = (e) => {
        votesStore.comment = e.target.value;
    }

    handleCheckboxChange = (e) => {
        votesStore.voteWithCategories[e.target.name] = e.target.checked;
    }

    render() {
        const topic = votesStore.currentTopic;
        return (
            <Modal
                title={`Vote for ${votesStore.selectedCandidate && votesStore.selectedCandidate.name}`}
                visible={votesStore.modalVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleModalCancel}
                okText='Save'>
                <div className='modal-header'>Please select categories for your vote</div>
                <div className='modal-body'>
                    <div className='modal-body__category-list'>
                        {topic && topic
                            .categories
                            .map(category => (
                                <div key={category.title} className='modal-body__item'>
                                    <label className='modal-body__label' htmlFor={category.title}>{category.title}</label>
                                    <input
                                        checked={votesStore.voteWithCategories[category.title]}
                                        name={category.title}
                                        onChange={this.handleCheckboxChange}
                                        className='modal-body__checkbox'
                                        id={category.title}
                                        type='checkbox'/>
                                </div>
                            ))}
                    </div>
                    <div className='field'>
                        <div className='modal-body__label'>
                            <label htmlFor='comment'>Comment</label>
                        </div>
                        <textarea
                            id='comment'
                            name='comment'
                            onChange={this.handleInputChange}
                            rows='4'
                            value={votesStore.comment}/>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default VoteModal;
