const votesStore = require('./votesStore');

/*
const topicVotes = [
    { topicId: '5a4b677bf36d284acc11434c', candidateName: 'Candidate 2', login: 'AAA' }
];
*/

module.exports = (ioGlobal) => {
    const io = ioGlobal.of('/votes');

    io.on('connection', async socket => {
        const { topicId } = socket.handshake.query;

        if (socket.topicId) {
            socket.leave(socket.topicId);
        }

        // eslint-disable-next-line
        socket.topicId = topicId;
        socket.join(topicId);

        const topicVotes = await votesStore.getTopicVotes(topicId);

        socket.emit('onVote', topicVotes);
        socket.on('vote', vote);
    });

    async function vote({ topicId, candidateName, login, isVote }) {
        const topicVotes = await votesStore.vote(topicId, candidateName, login, isVote);
        // Notify all clients
        io.to(topicId).emit('onVote', topicVotes);
    }
};
