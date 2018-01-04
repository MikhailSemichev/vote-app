import io from 'socket.io-client';

export default {
    vote,
    onVote
};

let socket = null;

async function vote(topicId, candidateName, login) {
    socket.emit('vote', { topicId, candidateName, login });
}

async function onVote(topicId, cb) {
    socket = io('http://localhost:3333');

    socket.on('onVote', topicVotes => {
        cb(topicVotes);
    });

    return () => socket.close();
}
