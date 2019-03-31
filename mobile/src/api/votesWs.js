import io from 'socket.io-client';
import config from '../../config';

export default {
    vote,
    onVote
};

let socket = null;

function vote(topicId, candidateName, login, isVote) {
    socket.emit('vote', { topicId, candidateName, login, isVote });
}

function onVote(topicId, cb) {
    socket = io(`${config.REACT_APP_SERVICE_URL}/votes`, { query: `topicId=${topicId}` });

    socket.on('onVote', topicVotes => {
        cb(topicVotes);
    });

    return () => socket.close();
}
