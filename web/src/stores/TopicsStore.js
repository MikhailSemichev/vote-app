import { observable, action, runInAction } from 'mobx';

import { topicsApi } from '../api';

class TopicsStore {
    @observable topics = [];

    @action
    async loadTopics() {
        this.topics = null;
        const topics = await topicsApi.getTopics();

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
}

export default new TopicsStore();
