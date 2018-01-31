import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import cn from 'classnames';

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
    render() {
        const topic = votesStore.currentTopic;
        const candidate = this.props.candidate;
        const categories = votesStore.currentTopic.categories;
        const isCategoriesPresented = votesStore.isCategoriesPresented;

        return (
            <tr>
                {topic.isActive}
                <td className={cn('candidate-name-cell', { 'is-voted': candidate.isVoted })}>{candidate.name}</td>
                {
                    isCategoriesPresented
                        ? categories.map(category => (
                            <td key={category.title}>
                                <span className='count-badge' title={candidate.loginsInEachCategory[category.title]}>
                                    {candidate.votesInEachCategory[category.title]}
                                </span>
                            </td>
                        ))
                        : (<td/>)
                }
                <td className='total-cell'>
                    <span className='count-badge' title={candidate.logins.join(' | ')}>
                        {votesStore.isCategoriesPresented ? candidate.votesInEachCategory.total : candidate.logins.length}
                    </span>
                </td>
                <td className='vote-cell'>
                    {topic.isActive && <i
                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !candidate.isVoted, 'fa-thumbs-up': candidate.isVoted })}
                        onClick={votesStore.isCategoriesPresented ? () => this.handleModalVisible(candidate) : () => this.handleVote(candidate.name, !candidate.isVoted)}/>}
                </td>
            </tr>
        );
    }
}
export default Candidate;
/*
                <div className={cn('candidate-item', { 'is-voted': c.isVoted })} key={c.name}>
                    <div className='votes-count'>
                        <div
                            className='count'
                            title={c.logins.join(' | ')}>
                            {c.logins.length}
                        </div>
                    </div>
                    <div className='candidate-name'>{c.name}</div>
                    {topic.isActive && <i
                        className={cn('fa', 'vote-btn', { 'fa-thumbs-o-up': !c.isVoted, 'fa-thumbs-up': c.isVoted })}
                        onClick={votesStore.isCategoriesPresented ? () => this.handleModalVisible(c) : () => this.handleVote(c.name, !c.isVoted)}/>}
                </div>
*/
