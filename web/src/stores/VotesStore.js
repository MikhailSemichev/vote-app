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
        this.voteWithCategories = {};
        this.comment = '';
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
        const categories = this.voteWithCategories;
        if (this.comment.trim()) { // Comment presented?
            return true; // Need to save vote then
        }
        return _.values(categories).includes(true); // Is there at least one checked checkbox? If there is then need to save vote
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
