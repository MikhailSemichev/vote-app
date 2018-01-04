import io from 'socket.io-client';

export default {
    vote,
    onVote
};

let socket = null;

async function vote(topicId, candidateName, login) {
    socket.emit('vote', { topicId, candidateName, login });
}

function onVote(topicId, cb) {
    socket = io('http://localhost:3333/votes');

    socket.on('onVote', topicVotes => {
        cb(topicVotes);
    });

    return () => socket.close();
}
