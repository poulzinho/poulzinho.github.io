import React from "react";
import {Card, Flag, Icon, List, Header} from "semantic-ui-react";

const experienceItems = [
    {
        degree: 'M.Sc. Informatics',
        university: 'Technical University of Munich',
        department: 'TUM Department of Informatics',
        major: 'Software Engineering',
        minor: 'Computer Graphics and Vision',
        country: {
            code: 'de',
            place: 'Garching, Germany'
        },
        date: 'Oct 2015 - Mar 2018',
        description: 'The Department of Informatics at the Technical University of Munich (TUM) always places high in the rankings. ' +
            'More than 40 professors perform research in 25 academic chairs on topics at the core of informatics and engineering informatics. ' +
            'This makes it one of the largest informatics departments in Germany.',
    },
    {
        degree: 'Engr. Information Systems & Computer Science',
        university: 'National Polytechnic School',
        department: 'Faculty of Systems Engineering',
        major: 'Software Engineering',
        minor: 'Computer Science',
        country: {
            code: 'ec',
            place: 'Quito, Ecuador'
        },
        date: 'Oct 2006 - Oct 2013',
        description: 'The Faculty of Systems Engineering of the National Polytechnic School offers research-oriented programs ' +
            'in Computer Science & Information and Communication Systems. ' +
            'To achieve quality, ethical and supportive training, it develops research projects ' +
            'aimed at solving problems of transcendence for the Latin American society.'
    },
];

export default class Education extends React.Component {

    render() {
        return (
            <Card fluid>
                <div ref={this.props.inputRef}></div>
                <Card.Content>
                    <Card.Header><Icon name='graduation'/> Education</Card.Header>
                </Card.Content>
                {experienceItems.map((education, i) =>
                    <Card.Content fluid='true' key={i}>
                        <Card.Header>
                            <Header as='h2' className='card-header-title'>
                                {education['degree']}
                                <Header.Subheader>
                                    <Icon name='angle double right'/>{education['major']}
                                </Header.Subheader>
                                <Header.Subheader>
                                    <Icon name='angle right'/>{education['minor']}
                                </Header.Subheader>
                            </Header>
                            <Header as='h3' className='card-header-title'>
                                {education['university']}
                                <Header.Subheader>
                                    {education['department']}
                                </Header.Subheader>
                            </Header>
                        </Card.Header>

                        <Card.Meta>
                            <List>
                                <List.Item className='cell-country'>
                                    <Flag name={education['country']['code']}/>
                                    <p>{education['country']['place']}</p>
                                </List.Item>
                                <List.Item className='cell-date'>
                                    <Icon name='calendar check outline'/>
                                    {education['date']}
                                </List.Item>
                            </List>
                        </Card.Meta>

                        <Card.Description>
                            <p>{education['description']}</p>
                        </Card.Description>
                    </Card.Content>
                )}
            </Card>
        )
    }

};

