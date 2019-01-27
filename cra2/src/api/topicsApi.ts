import axios from 'axios';
import { ITopic } from '../types/interfaces';

export default {
    getTopics,
    getTopic,
    saveTopic,
    deleteTopic,
    addCandidates,
};

async function getTopics(): Promise<ITopic[]> {
    const response = await axios.get<ITopic[]>('/topics');
    return response.data.map(mapTopic);
}

async function getTopic(id: string) {
    const response = await axios.get<ITopic>(`/topics/${id}`);
    if (response.data) {
        return mapTopic(response.data);
    }
    return null;
}

function mapTopic(topicJson: any): ITopic {
    return {
        ...topicJson,
        id: topicJson._id,
    };
}

async function saveTopic(topic: ITopic) {
    if (topic.id) {
        // update existing
        return axios.put('/topics', topic);
    }
    // create new
    return axios.post('/topics', topic);
}

async function deleteTopic(id: string) {
    return axios.delete(`/topics/${id}`);
}

function addCandidates(topicId: string, newCandidates: string[]) {
    return axios.post('/topics/addCandidates', { topicId, newCandidates });
}
