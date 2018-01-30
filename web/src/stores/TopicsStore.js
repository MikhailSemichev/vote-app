import { observable, action, runInAction } from 'mobx';

import { topicsApi } from '../api';

class TopicsStore {
    @observable topics = [];

    @action
    async loadTopics() {
        this.topics = null;
        const topics = await topicsApi.getTopics();
        topics.sort((t1, t2) => {
            return t1.id < t2.id;
        });

        runInAction(() => {
            this.topics = topics;
        });
    }

    getTopic(id) {
        return topicsApi.getTopic(id);
    }

    saveTopic(topic) {
        return topicsApi.saveTopic(topic);
    }

    async deleteTopic(id) {
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
