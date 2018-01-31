import io from 'socket.io-client';
import config from '../config';

export default {
    vote,
    onVote
};

let socket = null;

function vote(topicId, candidateName, login, isVote, voteInfo) {
    socket.emit('vote', { topicId, candidateName, login, isVote, voteInfo });
}

function onVote(topicId, cb) {
    socket = io(`${config.SERVICE_URL}/votes`, { query: `topicId=${topicId}` });

    socket.on('onVote', topicVotes => {
        cb(topicVotes);
    });

    return () => socket.close();
}
