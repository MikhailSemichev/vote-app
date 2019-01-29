import { observable, action, runInAction } from 'mobx';

import { votesWs } from '../api';
import loginStore from './LoginStore';
import { SOCKET_EVENTS } from '../constants';
import { IVote, ITopic } from '../types/interfaces';

class VotesStore {
    @observable topicVotes: IVote[] = [];

    @action
    async vote(topicId: string, candidateName: string, isVote: boolean) {
        return votesWs.vote(
            topicId,
            candidateName,
            loginStore.userInfo!.login,
            isVote,
        );
    }

    @action
    onTopicChange(topicId: string, onTopicChange: (topic: ITopic) => void) {
        this.topicVotes = [];
        return votesWs.onTopicVotesChange(
            topicId,
            (topicVotes: IVote[]) => {
                runInAction(() => {
                    this.topicVotes = topicVotes;
                });
            },
            onTopicChange,
        );
    }
}

export default new VotesStore();
