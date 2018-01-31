import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { votesStore } from '../../stores';
import { Candidate } from '../Candidate';

import './CandidatesList.scss';

@observer
class CandidatesList extends Component {
    render() {
        const candidatesInfo = votesStore.candidatesInfo;
        const categories = votesStore.currentTopic.categories;
        const isCategoriesPresented = votesStore.isCategoriesPresented;

        return (
            <table className='candidate-list'>
                <thead className='candidate-list__head'>
                    <tr>
                        <td className='candidate-name-cell'>Candidate Name</td>
                        {
                            isCategoriesPresented && votesStore.isNeedToShowDetailedInformation
                                ? categories.map(category => (
                                    <td key={category.title}>{category.title}</td>
                                ))
                                : (
                                    <td/>
                                )
                        }
                        <td className='total-cell'>Total</td>
                        <td className='vote-cell'/>
                    </tr>
                </thead>
                <tbody className='candidate-list__body'>
                    {candidatesInfo.map(c => (<Candidate key={c.name} candidate={c}/>))}
                </tbody>
            </table>
        );
    }
}
export default CandidatesList;
