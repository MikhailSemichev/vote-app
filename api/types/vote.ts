import { Document } from 'mongoose';

export interface IVote {
    id?: any,
    topicId: string,
    candidateName: string,
    login: string,
}

export interface IVoteInput extends IVote {
    isVote: boolean
}

export interface IVoteModel extends IVote, Document { }