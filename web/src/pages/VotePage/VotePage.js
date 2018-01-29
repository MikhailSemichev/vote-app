import React, { Component } from 'react';

import Vote from '../../components/Vote/Vote';
import VoteModal from '../../components/VoteModal/VoteModal';

class VotePage extends Component {
    render() {
        return (
            <div>
                <Vote />
                <VoteModal />
            </div>
        );
    }
}

export default VotePage;
