import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Popover } from 'antd';
import cn from 'classnames';

import { Comments } from '../Comments';
import { votesStore } from '../../stores';

@withRouter
class Candidate extends Component {
    handleVote = () => {
        const topicId = this.props.match.params.topicId;
        votesStore.vote(topicId, this.props.candidate.name, !this.props.candidate.isVoted);
    };

    handleModalVisible = () => {
        votesStore.modalVisible = true;
        votesStore.setSelectedCandidate(this.props.candidate);
    }

    handlePopoverClick = () => {
        votesStore.defineCommentsForChoosenCandidate(this.props.candidate);
    }

    render() {
        const { currentTopic : topic, isCategoriesPresented } = votesStore;
        const candidate = this.props.candidate;
        const categories = votesStore.currentTopic.categories;

        return (
            <tr>
                <td className={cn('candidate-name-cell', { 'is-voted': candidate.isVoted })}>{candidate.name}</td>
                {isCategoriesPresented && votesStore.isNeedToShowDetailedInformation
                    ? categories.map(category => (
                        <td key={category.title}>
                            <span
                                className='count-badge'
                                title={candidate.loginsInEachCategory[category.title] && candidate.loginsInEachCategory[category.title].join(' | ')}>
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
                            content={<Comments />}
                            title='Comments from users'
                            trigger='click'
                            onClick={this.handlePopoverClick}>
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
                        onClick={votesStore.isCategoriesPresented ? this.handleModalVisible : this.handleVote}/>}
                </td>
            </tr>
        );
    }
}

export default Candidate;
