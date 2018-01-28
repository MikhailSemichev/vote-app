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

async function vote(topicId, candidateName, login, isVote) {
    const topicItem = await topicsStore.getTopic(topicId);

    await ensureTopicVotesInCache(topicId);

    const topicVotesCacheItems = cache[topicId];

    if (!topicItem.isActive) { // check if the topic is active and allowed to count votes
        return topicVotesCacheItems;
    }

    const voteItem = topicVotesCacheItems.find(v => v.login === login && v.candidateName === candidateName);

    if (isVote) {
        if (!voteItem) {

            const voteItem = new Vote({ topicId, candidateName, login });

            // Save to Cache
            topicVotesCacheItems.push(voteItem);

            // Save to Mongo
            try {
                await voteItem.save();
            } catch (err) {
                topicVotesCacheItems.splice(topicVotesCacheItems.indexOf(voteItem), 1);
            }
        }
    } else {
        if (voteItem) {
            // Remove from Mongo
            await voteItem.remove();

            // Remove from Cache
            topicVotesCacheItems.splice(topicVotesCacheItems.indexOf(voteItem), 1);
        }
    }

    return topicVotesCacheItems;
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