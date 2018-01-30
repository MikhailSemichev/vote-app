import axios from 'axios';

export default {
    getTopics,
    getTopic,
    saveTopic,
    deleteTopic,
    addCandidates
};

async function getTopics() {
    const topics = await axios.get('/topics');
    return topics.map(mapTopic);
}

async function getTopic(id) {
    const topic = await axios.get(`/topics/${id}`);
    return mapTopic(topic);
}

function mapTopic(topicJson) {
    if (topicJson) {
        return {
            ...topicJson,
            id: topicJson._id
        };
    }
    return null;
}

async function saveTopic(topic) {
    if (topic.id) {
        // update existing
        return axios.put('/topics', topic);
    }
    // create new
    return axios.post('/topics', topic);
}

async function deleteTopic(id) {
    return axios.delete(`/topics/${id}`);
}

function addCandidates(topicId, newCandidates) {
    return axios.post('/topics/addCandidates', { topicId, newCandidates });
}
