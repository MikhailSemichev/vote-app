const Vote = require('./Vote');
const topicsStore = require('../topics/topicsStore');

const cache = {};

module.exports = {
    getTopicVotes,
    vote,
    removeTopicVotes
};

async function getTopicVotes(topicId) {
    await ensureTopicVotesInCache(topicId);
    return cache[topicId];
}

async function vote(topicId, candidateName, login, isVote, voteInfo) {
    const topicItem = await topicsStore.getTopic(topicId);
    await ensureTopicVotesInCache(topicId);

    const topicVotesCacheItems = cache[topicId];

    if (!topicItem.isActive) { // check if the topic is active and allowed to count votes
        return topicVotesCacheItems;
    }

    const voteItem = topicVotesCacheItems.find(v => v.login === login && v.candidateName === candidateName);

    if (isVote) {
        if (voteItem) {
            await updateVoteItem(voteItem, voteInfo);
        } else {
             await createVoteItem(topicId, candidateName, login, voteInfo);
        }
    } else {
        if (voteItem) {
            await removeVoteItem(topicId, voteItem);
        }
    }

    return cache[topicId];
}

async function createVoteItem(topicId, candidateName, login, voteInfo) {
    const { categories, comment } = voteInfo;
    const voteItem = new Vote({topicId, candidateName, login, categories, comment});

    // Save to Cache
    cache[topicId].push(voteItem);

    // Save to Mongo
    try {
        await voteItem.save();
    } catch (err) {
        cache[topicId].splice(cache[topicId].indexOf(voteItem), 1);
    }
}

async function updateVoteItem(voteItem, voteInfo) {
    const { categories, comment } = voteInfo;
    voteItem.categories = categories;
    voteItem.comment = comment;
    await voteItem.save();
}

async function removeVoteItem(topicId, voteItem) {
    // Remove from Mongo
    await voteItem.remove();

    // Remove from Cache
    cache[topicId].splice(cache[topicId].indexOf(voteItem), 1);
}

function removeTopicVotes(topicId) {
    delete cache[topicId];
    return Vote.remove({ topicId });
}

async function ensureTopicVotesInCache(topicId) {
    let topicVotes = cache[topicId];

    if (!topicVotes) {
        // Read from MongoDB
        topicVotes = await Vote.find({ topicId });
        topicVotes = topicVotes || [];

        // Store in cache
        cache[topicId] = topicVotes;
    }
}