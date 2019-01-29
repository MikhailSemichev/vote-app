import mongoose from 'mongoose';
import { IVoteModel } from '../../types/vote';

const voteSchema = new mongoose.Schema({
    topicId: { type: String },
    candidateName: { type: String },
    login: { type: String }
}, {
    collection: 'Votes'
});

export default mongoose.model<IVoteModel>('Vote', voteSchema);
