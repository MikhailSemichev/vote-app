import * as React from 'react';
import { Link } from 'react-router-dom';

import { ITopic } from '../../types/interfaces';

interface IProps {
    topic: ITopic;
    handleDelete: (topic: ITopic) => void;
}

export default class TopicItem extends React.Component<IProps> {
    handleDelete = () => {
        const { topic, handleDelete } = this.props;
        handleDelete(topic);
    };

    render() {
        const { topic } = this.props;
        return (
            <div className="topic-item">
                <Link className="topic-item-name" to={`/vote/${topic.id}`}>
                    {topic.name}
                </Link>
                <Link to={`/topic/${topic.id}`} title="Edit Topic">
                    <i className="fa fa-pencil-square-o" />
                </Link>
                <a href="#" onClick={this.handleDelete} title="Delete Topic">
                    <i className="fa fa-times" />
                </a>
            </div>
        );
    }
}
