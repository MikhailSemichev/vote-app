import { observable, action, runInAction } from 'mobx';

import { votesWs } from '../api';
import loginStore from './LoginStore';
import { SOCKET_EVENTS } from '../constants';
import { IVote } from '../types/interfaces';

class VotesStore {
    // TODO: !!!!!!!!!!
    @observable isLoadingTopicVotes = false;
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
    onTopicVotesChange(
        topicId: string,
        onChange: (type: SOCKET_EVENTS, votes: IVote[]) => void,
    ) {
        this.isLoadingTopicVotes = true;
        this.topicVotes = [];
        return votesWs.onTopicVotesChange(
            topicId,
            (type: SOCKET_EVENTS, topicVotes: IVote[]) => {
                if (type === SOCKET_EVENTS.ON_VOTE) {
                    runInAction(() => {
                        this.topicVotes = topicVotes;
                    });
                }
                onChange(type, topicVotes);
            },
        );
    }
}

export default new VotesStore();
