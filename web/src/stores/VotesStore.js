import { observable, action, runInAction, computed, extendObservable } from 'mobx';
import * as _ from 'lodash';

import { stableSort } from '../utils/utils';
import { votesWs } from '../api';
import loginStore from './LoginStore';

class VotesStore {
    @observable topicVotes = [];
    @observable currentTopic = null;
    @observable selectedCandidate = null;
    @observable modalVisible = false;
    @observable comment = '';
    @observable voteWithCategories = {};
    @observable isNeedToShowDetailedInformation = true;
    @observable allCommentsForChoosenCandidate = 'Loading...';
    @observable _candidatesInfo = []; // if it is not observable then candidatesInfo() doesn't recompute
    @observable sortingValue = 'total';

    @action
    async vote(topicId, candidateName, isVote) {
        let voteInfo = null;
        if (this.isCategoriesPresented) {
            const definedIsVote = this.defineValueOfIsVote();
            const chosenCategories = definedIsVote ? this.defineChosenCategories() : [];
            voteInfo = { categories: chosenCategories, comment: this.comment.trim() };
            votesWs.vote(topicId, candidateName, loginStore.userInfo.login, definedIsVote, voteInfo);
            this.comment = '';
        } else {
            voteInfo = { categories: [], comment: '' };
            votesWs.vote(topicId, candidateName, loginStore.userInfo.login, isVote, voteInfo);
        }
    }

    onVote(topicId) {
        return votesWs.onVote(topicId, (topicVotes, candidatesInfo) => {
            runInAction(() => {
                this.topicVotes = topicVotes;
                this._candidatesInfo = candidatesInfo;
            });
        });
    }

    @computed
    get isCategoriesPresented() {
        return this.currentTopic && this.currentTopic.categories.length > 0;
    }

    @computed
    get isAllowedToVote() {
        const isUserAllowedRemoveHisVote = this.selectedCandidate.choosenCategories && this.selectedCandidate.choosenCategories.length; // If User wants to remove vote (allowed if He've already voted)
        return _.values(this.voteWithCategories).includes(true) || isUserAllowedRemoveHisVote; // Is there at least one checked checkbox? If there is then user is allowed to vote
    }

    @computed
    get candidatesInfo() {
        let candidatesInfo = [];
        const { userInfo } = loginStore;
        candidatesInfo = this
            ._candidatesInfo
            .map(c => {
                const votesForParticularCandidate = this.topicVotes.filter(v => c.name === v.candidateName);
                const voteByCurrentUserForParticularCandidate = votesForParticularCandidate.find(vote => vote.login === userInfo.login);
                let choosenCategoriesByCurrentUserForParticularCandidate = null;
                let commentByCurrentUserForParticularCandidate = '';
                if (voteByCurrentUserForParticularCandidate) {
                    choosenCategoriesByCurrentUserForParticularCandidate = voteByCurrentUserForParticularCandidate.categories;
                    commentByCurrentUserForParticularCandidate = voteByCurrentUserForParticularCandidate.comment;
                }
                return {
                    ...c,
                    isVoted: c.logins.includes(userInfo.login),
                    choosenCategories: choosenCategoriesByCurrentUserForParticularCandidate,
                    comment: commentByCurrentUserForParticularCandidate
                };
            });
        candidatesInfo = stableSort(candidatesInfo, (c1, c2) => {
            return c2.logins.length - c1.logins.length;
        });
        if (this.isCategoriesPresented) {
            const bindedContextSortingValue = this.sortingValue;
            candidatesInfo = _.sortBy(candidatesInfo, [(obj) => {
                return obj.votesInEachCategory[bindedContextSortingValue];
            }]).reverse();
        }

        return candidatesInfo;
    }

    @action
    defineCommentsForChoosenCandidate(candidate) {
        this.allCommentsForChoosenCandidate = 'Loading...';
        const votesForCandidate = this.topicVotes.filter(vote => candidate.name === vote.candidateName);
        const votesWhereCommentPresented = votesForCandidate.filter(vote => vote.comment);
        this.allCommentsForChoosenCandidate = votesWhereCommentPresented.map(vote => ({ login : vote.login, comment: vote.comment }));
    }

    @action
    setCurrentTopic(topic) {
        this.currentTopic = topic;
        this.voteWithCategories = {};
        this.comment = '';
        this.sortingValue = 'total';
        this
            .currentTopic
            .categories
            .forEach(category => {
                extendObservable(this.voteWithCategories, {
                    [category.title]: false
                });
            });
    }

    @action
    setSelectedCandidate(candidate) {
        this.selectedCandidate = candidate;
        this.resetInputCheckBoxes();
        this.comment = candidate.comment;
        if (this.selectedCandidate.choosenCategories) {
            this.selectedCandidate.choosenCategories.forEach(category => {
                this.voteWithCategories[category.title] = true;
            });
        }
    }

    @action
    resetInputCheckBoxes() {
        _.forOwn(this.voteWithCategories, (value, key) => {
            this.voteWithCategories[key] = false;
        });
    }

    defineValueOfIsVote() {
        return _.values(this.voteWithCategories).includes(true); // Is there at least one checked checkbox? If there is then need to save vote
    }

    defineChosenCategories() {
        const choosenCategories = [];
        const categories = this.voteWithCategories;

        _.forOwn(categories, (value, key) => {
            if (value) {
                choosenCategories.push({ title: key }); // take checked checkboxes and push them in array
            }
        });

        return choosenCategories;
    }
}

export default new VotesStore();
