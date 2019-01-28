import { Document } from 'mongoose';

export interface ICandidate {
    name: string;
}

export interface ITopic {
    id?: any,
    name: string,
    candidates: ICandidate[],
    isActive: boolean,
    isAllowAddCandidates: boolean
}

export interface ITopicModel extends ITopic, Document {

}