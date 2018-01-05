const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    name: { type: String },
    topicId: { type: String },
    candidateName: { type: String },
    login: { type: String }
}, {
    collection: 'Votes'
});

voteSchema.options.toJSON = {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
};

module.exports = mongoose.model('Vote', voteSchema);
