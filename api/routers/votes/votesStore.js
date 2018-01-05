const Vote = require('./Vote');

const cache = {};

module.exports = {
    getTopicVotes,
    vote
};

async function getTopicVotes(topicId) {
    await ensureTopicVotesInCache(topicId);
    return cache[topicId];
}

async function vote(topicId, candidateName, login, isVote) {
    await ensureTopicVotesInCache(topicId);

    if (isVote) {
        // Save to Mongo
        const voteItem = new Vote({ topicId, candidateName, login });
        await voteItem.save();

        // Save to Cache
        cache[topicId].push(voteItem);
    } else {
        // TODO: Remove
    }

    return cache[topicId];
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
