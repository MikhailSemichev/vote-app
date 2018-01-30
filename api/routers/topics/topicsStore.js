const Topic = require('./Topic');
const eventHub = require('../../utils/eventHub');

let cache = [];

module.exports = {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic,
    addCandidates
};

async function getTopics() {
    await ensureTopicsInCache();
    return cache;
}

async function getTopic(id) {
    await ensureTopicsInCache();
    return cache.find(t => t.id === id);
}

async function createTopic(json) {
    const topic = new Topic(json);
    await topic.save();

    cache.push(topic);

    return topic;
}

async function updateTopic(json) {
    const topic = await getTopic(json.id);

    topic.name = json.name;
    topic.candidates = json.candidates;
    topic.isActive = json.isActive;
    topic.isAllowAddCandidates = json.isAllowAddCandidates;
    await topic.save();

    eventHub.emit('topic/update', topic);

    return topic;
}

async function deleteTopic(id) {
    const topic = await getTopic(id);
    await topic.remove();

    cache = cache.filter(t => t.id === id);

    eventHub.emit('topic/delete', topic);
}

async function addCandidates(id, newCandidates) {
    const topic = await getTopic(id);

    if (topic.isAllowAddCandidates) {
        topic.candidates = [
            ...topic.candidates,
            ...newCandidates
                .filter(name => !topic.candidates.find(c => c.name === name))
                .map(name => ({ name }))
        ];
        await topic.save();

        eventHub.emit('topic/update', topic);
    }

    return topic.isAllowAddCandidates;
}


async function ensureTopicsInCache() {
    if (!cache.isLoaded) {
        // Read from MongoDB
        cache = await Topic.find();
        cache.isLoaded = true;
    }
}
