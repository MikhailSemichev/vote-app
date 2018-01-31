import { observable, action, runInAction, computed, extendObservable } from 'mobx';

import { stableSort } from '../utils/utils';
import { votesWs } from '../api';
import loginStore from './LoginStore';

class VotesStore {
    @observable topicVotes = [];
    @observable currentTopic = null;
    @observable selectedCandidate = null;
    @observable modalVisible = false;
    @observable voteWithCategories = {
        comment: '',
        categories: {}
    };

    @action
    async vote(topicId, candidateName, isVote) {
        let voteInfo = null;
        if (this.isCategoriesPresented) {
            const definedIsVote = this.defineValueOfIsVote();
            const chosenCategories = this.defineChosenCategories();
            voteInfo = { categories: chosenCategories, comment: this.voteWithCategories.comment.trim() };
            votesWs.vote(topicId, candidateName, loginStore.userInfo.login, definedIsVote, voteInfo);
            this.voteWithCategories.comment = '';
        } else {
            voteInfo = { categories: [], comment: '' };
            votesWs.vote(topicId, candidateName, loginStore.userInfo.login, isVote, voteInfo);
        }
    }

    onVote(topicId) {
        return votesWs.onVote(topicId, topicVotes => {
            runInAction(() => {
                this.topicVotes = topicVotes;
            });
        });
    }

    @computed
    get isCategoriesPresented() {
        return this.currentTopic && this.currentTopic.categories.length > 0;
    }

    @computed
    get candidatesInfo() {
        let candidatesInfo = [];
        const { userInfo } = loginStore;

        if (this.currentTopic) {
            candidatesInfo = this
                .currentTopic
                .candidates
                .map(c => {
                    const votesForParticularCandidate = this.topicVotes.filter(v => c.name === v.candidateName);
                    const logins = votesForParticularCandidate.map(v => v.login);
                    const voteByCurrentUserForParticularCandidate = votesForParticularCandidate.find(vote => vote.login === userInfo.login);
                    let choosenCategoriesByCurrentUserForParticularCandidate = null;
                    let commentByCurrentUserForParticularCandidate = '';
                    if (voteByCurrentUserForParticularCandidate) {
                        choosenCategoriesByCurrentUserForParticularCandidate = voteByCurrentUserForParticularCandidate.categories;
                        commentByCurrentUserForParticularCandidate = voteByCurrentUserForParticularCandidate.comment;
                    }

                    return {
                        name: c.name,
                        isVoted: logins.includes(userInfo.login),
                        logins,
                        choosenCategories: choosenCategoriesByCurrentUserForParticularCandidate,
                        comment: commentByCurrentUserForParticularCandidate
                    };
                });
            candidatesInfo = stableSort(candidatesInfo, (c1, c2) => {
                return c2.logins.length - c1.logins.length;
            });
        }

        return candidatesInfo;
    }

    @action
    setCurrentTopic(topic) {
        this.currentTopic = topic;
        this.voteWithCategories.categories = {};
        this.voteWithCategories.comment = '';
        this
            .currentTopic
            .categories
            .forEach(category => {
                extendObservable(this.voteWithCategories.categories, {
                    [category.title]: false
                });
            });
    }

    @action
    setSelectedCandidate(candidate) {
        this.selectedCandidate = candidate;
        this.resetInputCheckBoxes();
        this.voteWithCategories.comment = candidate.comment;
        if (this.selectedCandidate.choosenCategories) {
            this.selectedCandidate.choosenCategories.forEach(category => {
                this.voteWithCategories.categories[category.title] = true;
            });
        }
    }

    @action
    resetInputCheckBoxes() {
        for (const key in this.voteWithCategories.categories) {
            if (this.voteWithCategories.categories.hasOwnProperty(key)) {
                this.voteWithCategories.categories[key] = false;
            }
        }
    }

    defineValueOfIsVote() {
        if (this.voteWithCategories.comment.trim()) { // Comment presented?
            return true; // Need to save vote then
        }
        for (const key in this.voteWithCategories.categories) {
            if (this.voteWithCategories.categories.hasOwnProperty(key)) {
                if (this.voteWithCategories.categories[key]) { // Is there at least one checked checkbox?
                    return true; // Need to save vote then
                }
            }
        }

        return false; // there is no vote
    }

    defineChosenCategories() {
        const choosenCategories = [];

        for (const key in this.voteWithCategories.categories) {
            if (this.voteWithCategories.categories.hasOwnProperty(key) && this.voteWithCategories.categories[key]) {
                choosenCategories.push({ title: key });
            }
        }

        return choosenCategories;
    }
}

export default new VotesStore();
