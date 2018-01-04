const topicVotes = [
    { name: 'vika', turn: 'X' },
    { name: 'sasha', turn: 'X' },
    { name: 'igor', turn: 'X' }
];

module.exports = (ioGlobal) => {
    const io = ioGlobal.of('/votes');

    io.on('connection', socket => {
        if (socket.room) {
            socket.leave(socket.room);
        }

        socket.room = 'room';
        socket.join('room');
        socket.emit('onVote', topicVotes);

        socket.on('vote', vote);
    });

    function vote(data) {
        topicVotes.push(data);
        // Notify all clients
        io.to('room').emit('onVote', topicVotes);
    }
};
