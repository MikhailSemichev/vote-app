const mongoose = require('mongoose');

const topicSchema = new mongoose.Schema({
    name: { type: String },
    candidates: [{ name: String }],
    categories: [{ title: String}],
    isActive: { type: Boolean }
}, {
    collection: 'Topics'
});

module.exports = mongoose.model('Topic', topicSchema);
