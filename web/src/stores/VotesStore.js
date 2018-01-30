import { observable, action, runInAction } from 'mobx';

import { votesWs } from '../api';
import loginStore from './LoginStore';
import { ON_VOTE } from '../constants/topicEvents';

class VotesStore {
    @observable topicVotes = null;

    @action
    async vote(topicId, candidateName, isVote) {
        return votesWs.vote(topicId, candidateName, loginStore.userInfo.login, isVote);
    }

    onTopicVotesChange(topicId, onChange) {
        return votesWs.onTopicVotesChange(topicId, (type, data) => {
            if (type === ON_VOTE) {
                runInAction(() => {
                    this.topicVotes = data;
                });
            }
            onChange(type, data);
        });
    }
}

export default new VotesStore();
