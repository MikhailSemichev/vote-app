import votesStore from './votesStore';
import eventHub from '../../utils/eventHub';

import { ITopic, ITopicSocket } from '../../types/topic';
import { IVoteInput, IVote } from '../../types/vote';

export default (ioGlobal: SocketIO.Server): void => {
    const io = ioGlobal.of('/votes');

    io.on('connection', async (socket: ITopicSocket) => {
        const { topicId } = socket.handshake.query;

        if (socket.topicId) {
            socket.leave(socket.topicId);
        }

        // eslint-disable-next-line
        socket.topicId = topicId;
        socket.join(topicId);

        const topicVotes: IVote[] = await votesStore.getTopicVotes(topicId);

        socket.emit('ON_VOTE', topicVotes);
        socket.on('vote', vote);
    });

    async function vote({ topicId, candidateName, login, isVote }: IVoteInput): Promise<void> {
        const topicVotes: IVote[] = await votesStore.vote(topicId, candidateName, login, isVote);
        // Notify all clients
        io.to(topicId).emit('ON_VOTE', topicVotes);
    }

    // Topic events

    eventHub.on('topic/update', onTopicChange);
    eventHub.on('topic/delete', async (topic: ITopic): Promise<void> => {
        await votesStore.removeTopicVotes(topic.id);
        onTopicChange(topic);
    });

    function onTopicChange(topic: ITopic): void {
        // Notify all clients
        io.to(topic.id).emit('ON_TOPIC_CHANGE', topic);
    }
};
