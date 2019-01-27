const express = require('express');
const topicsStore = require('./topicsStore');
const admin = require('../../middleware/adminMiddleware');

module.exports = app => {
    const topicsRouter = express.Router();
    app.use('/api/topics', topicsRouter);

    topicsRouter.get('/', app.wrap(async (req, res) => {
        // const topics = await Topic.find();
        const topics = await topicsStore.getTopics();
        res.json(topics);
    }));

    topicsRouter.get('/:topicId', app.wrap(async (req, res) => {
        const topic = await topicsStore.getTopic(req.params.topicId);
        res.json(topic);
    }));

    topicsRouter.post('/', app.wrap(async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.createTopic(req.body);

        res.status(201).send(topic);
    }));

    topicsRouter.put('/', admin(), app.wrap(async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await topicsStore.updateTopic(req.body);

        res.status(200).send(topic);
    }));

    topicsRouter.delete('/:topicId', admin(), app.wrap(async (req, res) => {
        const { topicId } = req.params;

        await topicsStore.deleteTopic(topicId);

        res.status(204).send('');
    }));

    topicsRouter.post('/addCandidates', app.wrap(async (req, res) => {
        const { topicId, newCandidates } = req.body;

        const isAllowAddCandidates = await topicsStore.addCandidates(topicId, newCandidates);

        if (!isAllowAddCandidates) {
            res.status(400).send('Unable to add candidates');
            return;
        }

        res.status(201).send('');
    }));

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
