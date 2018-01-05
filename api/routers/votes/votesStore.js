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

    const topicVotesCache = cache[topicId];

    if (isVote) {
        // Save to Mongo
        const voteItem = new Vote({ topicId, candidateName, login });
        await voteItem.save();

        // Save to Cache
        topicVotesCache.push(voteItem);
    } else {
        const voteItem = topicVotesCache.find(v =>
            v.login === login
            && v.candidateName === candidateName);

        if (voteItem) {
            // Remove from Mongo
            await voteItem.remove();

            // Remove from Cache
            topicVotesCache.splice(topicVotesCache.indexOf(voteItem), 1);
        }
    }

    return topicVotesCache;
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
