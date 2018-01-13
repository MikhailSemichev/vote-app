const express = require('express');
const topicsStore = require('./topicsStore');
const votesStore = require('../votes/votesStore');

module.exports = app => {
    const topicsRouter = express.Router();
    app.use('/api/topics', topicsRouter);

    topicsRouter.get('/', async (req, res) => {
        const topics = await topicsStore.getTopics();
        res.json(topics);
    });

    topicsRouter.get('/:topicId', async (req, res) => {
        const topic = await topicsStore.getTopic(req.params.topicId);
        res.json(topic);
    });

    topicsRouter.post('/', async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.createTopic(req.body);

        res.status(201).send(topic);
    });

    topicsRouter.put('/', async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.updateTopic(req.body);

        res.status(200).send(topic);
    });

    topicsRouter.delete('/:topicId', async (req, res) => {
        const { topicId } = req.params;

        await Promise.all([
            topicsStore.deleteTopic(topicId),
            votesStore.removeTopicVotes(topicId)
        ]);

        res.status(204).send('');
    });

    function validateTopic(topic) {
        if (!topic.name) {
            return 'Name is required';
        }
        if (!topic.candidates || !topic.candidates.length) {
            return 'Candidates are required';
        }
        return null;
    }
};
