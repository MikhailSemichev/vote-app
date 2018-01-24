const Vote = require('./Vote');

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

async function vote(topicId, candidateName, login, isVote) {
    await ensureTopicVotesInCache(topicId);

    const topicVotesCache = cache[topicId];

    const voteItem = topicVotesCache.find(v => v.login === login && v.candidateName === candidateName);

    if (isVote) {
        if (!voteItem) {

            const voteItem = new Vote({topicId, candidateName, login});

            // Save to Cache
            topicVotesCache.push(voteItem);

            // Save to Mongo
            try {
                await voteItem.save();
            } catch (err) {
                topicVotesCache.splice(topicVotesCache.indexOf(voteItem), 1);
            }
        }
    } else {
        if (voteItem) {
            // Remove from Mongo
            await voteItem.remove();

            // Remove from Cache
            topicVotesCache.splice(topicVotesCache.indexOf(voteItem), 1);
        }
    }

    return topicVotesCache;
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
