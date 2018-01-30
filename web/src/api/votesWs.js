import io from 'socket.io-client';
import config from '../config';
import { ON_VOTE, ON_TOPIC_CHANGE } from '../constants/topicEvents';

export default {
    vote,
    onTopicVotesChange
};

let socket = null;

function vote(topicId, candidateName, login, isVote) {
    socket.emit('vote', { topicId, candidateName, login, isVote });
}

function onTopicVotesChange(topicId, onChange) {
    socket = io(`${config.SERVICE_URL}/votes`, { query: `topicId=${topicId}` });

    socket.on(ON_VOTE, topicVotes => {
        onChange(ON_VOTE, topicVotes);
    });

    socket.on(ON_TOPIC_CHANGE, topic => {
        onChange(ON_TOPIC_CHANGE, topic);
    });

    return () => socket.close();
}
