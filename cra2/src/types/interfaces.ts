export interface ITopic {
    _id: string; // do not use
    id: string;
    name: string;
}

export interface IVote {
    topicId: string;
    candidateName: string;
    login: string;
}
