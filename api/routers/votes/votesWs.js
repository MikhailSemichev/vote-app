const votesStore = require('./votesStore');
const eventHub = require('../../utils/eventHub');

module.exports = ioGlobal => {
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

        socket.emit('ON_VOTE', topicVotes);
        socket.on('vote', vote);
    });

    async function vote({ topicId, candidateName, login, isVote }) {
        const topicVotes = await votesStore.vote(topicId, candidateName, login, isVote);
        // Notify all clients
        io.to(topicId).emit('ON_VOTE', topicVotes);
    }

    // Topic events

    eventHub.on('topic/update', onTopicChange);
    eventHub.on('topic/delete', async topic => {
        await votesStore.removeTopicVotes(topic.id);
        onTopicChange(topic);
    });

    function onTopicChange(topic) {
        // Notify all clients
        io.to(topic.id).emit('ON_TOPIC_CHANGE', topic);
    }
};
