import { observable, action, runInAction } from 'mobx';

import { votesWs } from '../api';
import loginStore from './LoginStore';

class VotesStore {
    @observable topicVotes = [];

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
}

export default new VotesStore();
