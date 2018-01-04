import { observable, action, runInAction } from 'mobx';

import { votesWs } from '../api';
import loginStore from './LoginStore';

class VotesStore {
    @observable topicVotes = [];

    @action
    async vote(topicId, candidateName) {
        return votesWs.vote(topicId, candidateName, loginStore.login);
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
