import { observable, action, runInAction, computed } from 'mobx';

import { stableSort } from '../utils/utils';
import { votesWs } from '../api';
import loginStore from './LoginStore';

class VotesStore {
    @observable topicVotes = [];
    @observable currentTopic = null;
    @observable selectedCandidate = null;
    @observable modalVisible = false;
    @observable comment = '';

    @action
    async vote(topicId, candidateName, isVote) {
        return votesWs.vote(topicId, candidateName, loginStore.userInfo.login, isVote);
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
            candidatesInfo = this.currentTopic
                .candidates
                .map(c => {
                    const logins = this.topicVotes
                        .filter(v => c.name === v.candidateName)
                        .map(v => v.login);

                    return {
                        name: c.name,
                        isVoted: logins.includes(userInfo.login),
                        logins
                    };
                });
            candidatesInfo = stableSort(candidatesInfo, (c1, c2) => {
                return c2.logins.length - c1.logins.length;
            });
        }

        return candidatesInfo;
    }
}

export default new VotesStore();
