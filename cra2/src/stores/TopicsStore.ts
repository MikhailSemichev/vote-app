import { observable, action, runInAction } from 'mobx';

import { stableSort } from '../utils/utils';
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

        runInAction(() => {
            this.topics = stableSort(topics, (t1, t2) => {
                if (t1.id === t2.id) {
                    return 0;
                }
                return t1.id < t2.id ? -1 : 1;
            });
            this.isLoadingTopics = false;
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

    addCandidates(topicId: string, newCandidates: string[]) {
        return topicsApi.addCandidates(topicId, newCandidates);
    }
}

export default new TopicsStore();
