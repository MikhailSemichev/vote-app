import { observable, action, runInAction } from 'mobx';

import { topicsApi } from '../api';
import { ITopic } from '../types/interfaces';

class TopicsStore {
    @observable isLoadingTopics = false;
    @observable topics: ITopic[] = [];

    @action
    async loadTopics() {
        this.isLoadingTopics = true;
        this.topics = [];
        const topics = await topicsApi.getTopics();
        topics.sort((t1, t2) => {
            return t1.id < t2.id;
        });

        runInAction(() => {
            this.topics = topics;
        });
    }

    getTopic(id: string) {
        return topicsApi.getTopic(id);
    }

    saveTopic(topic: ITopic) {
        return topicsApi.saveTopic(topic);
    }

    async deleteTopic(id: string) {
        await topicsApi.deleteTopic(id);
        runInAction(() => {
            this.topics = this.topics.filter(t => t.id !== id);
        });
    }

    addCandidates(topicId, newCandidates) {
        return topicsApi.addCandidates(topicId, newCandidates);
    }
}

export default new TopicsStore();
