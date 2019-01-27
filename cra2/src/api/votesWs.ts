import io from 'socket.io-client';
import { SERVICE_URL, ON_VOTE, ON_TOPIC_CHANGE } from '../constants';

export default {
    vote,
    onTopicVotesChange,
};

let socket = null;

function vote(
    topicId: string,
    candidateName: string,
    login: string,
    isVote: boolean,
) {
    socket.emit('vote', { topicId, candidateName, login, isVote });
}

function onTopicVotesChange(topicId: string, onChange) {
    socket = io(`${SERVICE_URL}/votes`, { query: `topicId=${topicId}` });

    socket.on(ON_VOTE, topicVotes => {
        onChange(ON_VOTE, topicVotes);
    });

    socket.on(ON_TOPIC_CHANGE, topic => {
        onChange(ON_TOPIC_CHANGE, topic);
    });

    return () => socket.close();
}
