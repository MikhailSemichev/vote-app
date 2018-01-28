const Topic = require('./Topic');

let cache = [];

module.exports = {
    getTopics,
    getTopic,
    createTopic,
    updateTopic,
    deleteTopic
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
    topic.categories = json.categories;
    topic.isActive = json.isActive;
    await topic.save();

    return topic;
}

async function deleteTopic(id) {
    const topic = await getTopic(id);
    await topic.remove();

    cache = cache.filter(t => t.id === id);
}

async function ensureTopicsInCache() {
    if (!cache.isLoaded) {
        // Read from MongoDB
        cache = await Topic.find();
        cache.isLoaded = true;
    }
}
