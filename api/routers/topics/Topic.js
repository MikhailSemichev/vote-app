const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: { type: String },
    candidates: [{ name: String }]
}, {
    collection: 'Topics'
});

module.exports = mongoose.model('Topic', topicSchema);
