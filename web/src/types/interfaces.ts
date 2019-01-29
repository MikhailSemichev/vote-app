export interface ITopic {
    _id?: string; // do not use
    id?: string;
    name: string;
    isActive: boolean;
    isAllowAddCandidates: boolean;
    candidates: ICandidate[];
}

export interface ICandidate {
    name: string;
}

export interface IVote {
    topicId: string;
    candidateName: string;
    login: string;
}
