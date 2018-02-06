const Vote = require('./Vote');
const topicsStore = require('../topics/topicsStore');
const _ = require('lodash');

const cache = {};

module.exports = {
    getTopicVotes,
    vote,
    removeTopicVotes
};

async function getTopicVotes(topicId) {
    await ensureTopicVotesInCache(topicId);
    const topicVotes = cache[topicId];
    const topic = await topicsStore.getTopic(topicId);
    const candidatesInfo = computeInfoForCandidates(topic, topicVotes);
    return { topicVotes, candidatesInfo };
}

function computeInfoForCandidates(topic, topicVotes) {
    const isCategoriesPresented = topic.categories.length > 0;
    const candidatesInfo = topic.candidates.map(c => {
        const votesForParticularCandidate = topicVotes.filter(v => c.name === v.candidateName);
        const logins = votesForParticularCandidate.map(v => v.login);
        const votesInEachCategory = isCategoriesPresented ? defineVotesInEachCategory(topic, votesForParticularCandidate) : [];
        const loginsInEachCategory = isCategoriesPresented ? defineLoginsInEachCategory(topic, votesForParticularCandidate) : [];

            return {
                name: c.name,
                logins,
                votesInEachCategory,
                loginsInEachCategory
            };
        });
    return candidatesInfo;
}

function defineVotesInEachCategory(topic, votesForParticularCandidate) {
    const result = {};
    topic.categories.forEach(category => {
        result[category.title] = 0;
    });
    const categoriesFromEachVote = _.flatten(votesForParticularCandidate.map(vote => vote.categories));
    categoriesFromEachVote.forEach(category => result[category.title]++);
    result.total = categoriesFromEachVote.length;
    return result;
}

function defineLoginsInEachCategory(topic, votesForParticularCandidate) {
    const result = {};
    topic.categories.forEach(category => {
        result[category.title] = [];
    });
    votesForParticularCandidate.forEach(vote => {
        vote.categories.forEach(category => {
            result[category.title].push(vote.login);
        });
    });
    return result;
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

    const topicVotes = cache[topicId];
    const candidatesInfo = computeInfoForCandidates(topicItem, topicVotesCacheItems);

    return { topicVotes, candidatesInfo };
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