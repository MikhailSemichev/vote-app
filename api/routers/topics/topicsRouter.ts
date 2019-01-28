import express, { Application } from 'express';

import topicsStore from './topicsStore';
import admin from '../../middleware/adminMiddleware';
import Topic from './Topic';

import { wrap } from '../../utils/utils';
import { ITopic } from './types';

export default (app: Application) => {
    const topicsRouter = express.Router();
    app.use('/api/topics', topicsRouter);

    topicsRouter.get('/', wrap(async (req, res) => {
        // const topics = await Topic.find();
        const topics = await topicsStore.getTopics();
        res.json(topics);
    }));

    topicsRouter.get('/:topicId', wrap(async (req, res) => {
        const topic = await topicsStore.getTopic(req.params.topicId);
        res.json(topic);
    }));

    topicsRouter.post('/', wrap(async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.createTopic(req.body);

        res.status(201).send(topic);
    }));

    topicsRouter.put('/', admin(), wrap(async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.updateTopic(req.body);

        res.status(200).send(topic);
    }));

    topicsRouter.delete('/:topicId', admin(), wrap(async (req, res) => {
        const { topicId } = req.params;

        await topicsStore.deleteTopic(topicId);

        res.status(204).send('');
    }));

    topicsRouter.post('/addCandidates', wrap(async (req, res) => {
        const { topicId, newCandidates } = req.body;

        const isAllowAddCandidates = await topicsStore.addCandidates(topicId, newCandidates);

        if (!isAllowAddCandidates) {
            res.status(400).send('Unable to add candidates');
            return;
        }

        res.status(201).send('');
    }));

    function validateTopic(topic: ITopic) {
        if (!topic.name) {
            return 'Name is required';
        }
        if (!topic.candidates || !topic.candidates.length) {
            return 'Candidates are required';
        }
        return null;
    }
};
