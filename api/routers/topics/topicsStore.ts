import Topic from './Topic';
import eventHub from '../../utils/eventHub';

import { ITopicModel, ICandidate } from './types';

let isLoaded: boolean = false;
let cache: ITopicModel[] = [];

export default {
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

async function getTopic(id: any) {
    await ensureTopicsInCache();
    return cache.find((t: ITopicModel) => t.id === id) || null;
}

async function createTopic(json: ITopicModel) {
    const topic = new Topic(json);
    await topic.save();

    cache.push(topic);

    return topic;
}

async function updateTopic(json: ITopicModel) {
    const topic = await getTopic(json.id);

    if (topic === null) {
        return;
    }

    topic.name = json.name;
    topic.candidates = json.candidates;
    topic.isActive = json.isActive;
    topic.isAllowAddCandidates = json.isAllowAddCandidates;
    await topic.save();

    eventHub.emit('topic/update', topic);

    return topic;
}

async function deleteTopic(id: any) {
    const topic = await getTopic(id);

    if (topic === null) {
        return;
    }

    await topic.remove();

    cache = cache.filter(t => t.id === id);

    eventHub.emit('topic/delete', topic);
}

async function addCandidates(id: any, newCandidates: string[]) {
    const topic = await getTopic(id);

    if (topic === null) {
        return;
    }

    if (topic.isAllowAddCandidates) {
        topic.candidates = [
            ...topic.candidates,
            ...newCandidates
                .filter((name: string) => !topic.candidates.find((c: ICandidate) => c.name === name))
                .map((name: string) => ({ name }))
        ];
        await topic.save();

        eventHub.emit('topic/update', topic);
    }

    return topic.isAllowAddCandidates;
}


async function ensureTopicsInCache() {
    if (!isLoaded) {
        // Read from MongoDB
        cache = await Topic.find();
        isLoaded = true;
    }
}
