import io from 'socket.io-client';

export default {
    vote,
    onVote
};

let socket = null;

function vote(topicId, candidateName, login, isVote) {
    socket.emit('vote', { topicId, candidateName, login, isVote });
}

function onVote(topicId, cb) {
    socket = io('http://localhost:3333/votes', { query: `topicId=${topicId}` });

    socket.on('onVote', topicVotes => {
        cb(topicVotes);
    });

    return () => socket.close();
}
