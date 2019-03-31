import io from 'socket.io-client';
import { REACT_APP_SERVICE_URL, SOCKET_EVENTS } from '../constants';
import { IVote, ITopic } from '../types/interfaces';

export default {
    vote,
    onTopicVotesChange,
};

let socket: SocketIOClient.Socket;

function vote(
    topicId: string,
    candidateName: string,
    login: string,
    isVote: boolean,
) {
    socket.emit('vote', { topicId, candidateName, login, isVote });
}

function onTopicVotesChange(
    topicId: string,
    onVote: (topicVotes: IVote[]) => void,
    onTopicChange: (topic: ITopic) => void,
) {
    socket = io(`${REACT_APP_SERVICE_URL}/votes`, { query: `topicId=${topicId}` });

    socket.on(SOCKET_EVENTS.ON_VOTE, (topicVotes: IVote[]) => {
        onVote(topicVotes);
    });

    socket.on(SOCKET_EVENTS.ON_TOPIC_CHANGE, (topic: ITopic) => {
        onTopicChange(topic);
    });

    return () => socket.close();
}
