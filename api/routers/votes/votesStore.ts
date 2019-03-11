import Vote from './Vote';
import topicsStore from '../topics/topicsStore';

import { ITopicModel } from '../../types/topic';
import { IVoteModel } from '../../types/vote';

const cache: { [id: string] : IVoteModel[]; } = {};

export default {
    getTopicVotes,
    vote,
    removeTopicVotes
};

async function getTopicVotes(topicId: string): Promise<IVoteModel[]> {
    await ensureTopicVotesInCache(topicId);
    return cache[topicId];
}

async function vote(topicId: string, candidateName: string, login: string, isVote: boolean): Promise<IVoteModel[]> {
    const topicItem: ITopicModel | null = await topicsStore.getTopic(topicId);

    await ensureTopicVotesInCache(topicId);

    const topicVotesCacheItems = cache[topicId];

    if (!topicItem!.isActive) { // check if the topic is active and allowed to count votes
        return topicVotesCacheItems;
    }

    let voteItem: IVoteModel | undefined = topicVotesCacheItems.find(v => v.login === login && v.candidateName === candidateName);

    if (isVote) {
        if (!voteItem) {
            voteItem = new Vote({ topicId, candidateName, login });

            // Save to Cache
            topicVotesCacheItems.push(voteItem);

            // Save to Mongo
            try {
                await voteItem.save();
            } catch (err) {
                topicVotesCacheItems.splice(topicVotesCacheItems.indexOf(voteItem), 1);
            }
        }
    } else if (voteItem) {
        // Remove from Mongo
        await voteItem.remove();

        // Remove from Cache
        topicVotesCacheItems.splice(topicVotesCacheItems.indexOf(voteItem), 1);
    }

    return topicVotesCacheItems;
}

async function removeTopicVotes(topicId: string): Promise<void> {
    delete cache[topicId];
    await Vote.remove({ topicId });
}

async function ensureTopicVotesInCache(topicId: string): Promise<void> {
    let topicVotes: IVoteModel[] = cache[topicId];

    if (!topicVotes) {
        // Read from MongoDB
        topicVotes = await Vote.find({ topicId });
        topicVotes = topicVotes || [];

        // Store in cache
        cache[topicId] = topicVotes;
    }
}
