import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Popover } from 'antd';
import cn from 'classnames';

import { Comments } from '../Comments';
import { votesStore } from '../../stores';

@withRouter
class Candidate extends Component {
    handleVote = (candidateName, isVote) => {
        const topicId = this.props.match.params.topicId;
        votesStore.vote(topicId, candidateName, isVote);
    };

    handleModalVisible = (candidate) => {
        votesStore.modalVisible = true;
        votesStore.setSelectedCandidate(candidate);
    }

    handlePopoverClick(candidate) {
        votesStore.defineCommentsForChoosenCandidate(candidate);
    }

    render() {
        const topic = votesStore.currentTopic;
        const candidate = this.props.candidate;
        const categories = votesStore.currentTopic.categories;
        const isCategoriesPresented = votesStore.isCategoriesPresented;

        return (
            <tr>
                {topic.isActive}
                <td className={cn('candidate-name-cell', { 'is-voted': candidate.isVoted })}>{candidate.name}</td>
                {isCategoriesPresented && votesStore.isNeedToShowDetailedInformation
                    ? categories.map(category => (
                        <td key={category.title}>
                            <span
                                className='count-badge'
                                title={candidate.loginsInEachCategory[category.title].join(' | ')}>
                                {candidate.votesInEachCategory[category.title]}
                            </span>
                        </td>
                    ))
                    : (<td/>)
                }
                <td className='total-cell'>
                    {votesStore.isCategoriesPresented
                        ? <Popover
                            placement='bottom'
                            content={< Comments />}
                            title='Comments from users'
                            trigger='click'
                            onClick={() => this.handlePopoverClick(candidate)}>
                            <span
                                className='count-badge clickable-badge'
                                title={candidate.logins.join(' | ')}>
                                {candidate.votesInEachCategory.total}
                            </span>
                        </Popover>
                        : (
                            <span
                                className='count-badge'
                                title={candidate.logins.join(' | ')}>
                                {candidate.logins.length}
                            </span>
                        )
                    }

                </td>
                <td className='vote-cell'>
                    {topic.isActive && <i
                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !candidate.isVoted, 'fa-thumbs-up': candidate.isVoted })}
                        onClick={votesStore.isCategoriesPresented
                            ? () => this.handleModalVisible(candidate)
                            : () => this.handleVote(candidate.name, !candidate.isVoted)}/>}
                </td>
            </tr>
        );
    }
}

export default Candidate;
