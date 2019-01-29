import mongoose, { Schema } from 'mongoose';

import { ITopicModel } from '../../types/topic';

const TopicSchema: Schema = new mongoose.Schema({
    name: { type: String },
    candidates: [{ name: String }],
    isActive: { type: Boolean },
    isAllowAddCandidates: { type: Boolean }
}, {
    collection: 'Topics'
});

export default mongoose.model<ITopicModel>('Topic', TopicSchema);
