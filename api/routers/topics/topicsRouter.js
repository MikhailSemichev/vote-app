const express = require('express');
const Topic = require('./Topic');

module.exports = app => {
    const topicsRouter = express.Router();
    app.use('/api/topics', topicsRouter);

    topicsRouter.get('/', async (req, res) => {
        const topics = await Topic.find();
        res.json(topics);
    });

    topicsRouter.get('/:topicId', async (req, res) => {
        const topic = await Topic.findById(req.params.topicId);
        res.json(topic);
    });

    topicsRouter.post('/', async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = new Topic(req.body);

        topic.save();
        res.status(201).send(topic);
    });

    topicsRouter.put('/', async (req, res) => {
        const err = validateTopic(req.body);

        if (err) {
            res.status(400).send(err);
            return;
        }

        const topic = await Topic.findById(req.body.id);

        topic.name = req.body.name;
        topic.candidates = req.body.candidates;

        topic.save();
        res.status(200).send(topic);
    });

    topicsRouter.delete('/:topicId', async (req, res) => {
        const topic = await Topic.findById(req.params.topicId);

        await topic.remove();
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
