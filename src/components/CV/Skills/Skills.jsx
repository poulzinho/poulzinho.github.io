import React from "react";
import SkillsCard from '../SkillsCard/SkillsCard';
import {Header, Icon} from 'semantic-ui-react'

export default class Skills extends React.Component {
    render() {
        return (
            <div ref={this.props.inputRef} className='no-print grid-row mobile only'>
                <Header as='h3'><Icon name='terminal'/>Skills</Header>
                <SkillsCard/>
            </div>
        )
    }
};
