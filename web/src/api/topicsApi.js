import axios from 'axios';

export default {
    getTopics,
    getTopic,
    saveTopic,
    deleteTopic
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
    return {
        ...topicJson,
        id: topicJson._id
    };
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
