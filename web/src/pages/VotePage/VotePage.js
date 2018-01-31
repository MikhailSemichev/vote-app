import React, { Component } from 'react';

import { Vote } from '../../components/Vote/';
import { VoteModal } from '../../components/VoteModal/';

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
