const socketIo = require('socket.io');

const topicVotes = [
    { name: 'vika', turn: 'X' },
    { name: 'sasha', turn: 'X' },
    { name: 'igor', turn: 'X' }
];

module.exports = (app) => {
    const io = socketIo();
    // eslint-disable-next-line
    app.io = io;

    io.on('connection', socket => {
        socket.emit('onVote', topicVotes);
        socket.on('vote', vote);
    });

    function vote(data) {
        topicVotes.push(data);
        // Notify all clients
        io.emit('onVote', topicVotes);
    }
};
