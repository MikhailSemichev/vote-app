import React from 'react';
import { observer } from 'mobx-react';

import { votesStore } from '../../stores';

import './Comments.scss';

@observer
class Comments extends React.Component {
    render() {
        const comments = votesStore.allCommentsForChoosenCandidate;
        return comments.length
            ? comments.map((comment, index) => (
                <div className='comment' key={index}>
                    <span className='comment__login'>
                        {comment.login}
                    </span>
                    : {comment.comment}
                </div>
            ))
            : (
                <div>No comments</div>
            );
    }
}

export default Comments;
