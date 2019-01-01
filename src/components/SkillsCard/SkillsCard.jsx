import React from 'react'
import './SkillsCard.css';
import {Card, Icon, Progress, Rating, Table} from 'semantic-ui-react'

const skills = [
    {
        title: 'Programming languages',
        type: 'rating',
        items: [
            {
                name: 'JavaScript',
                value: '6',
                icon: 'assets/javascript.svg'
            },
            {
                name: 'ES6',
                value: '6',
                icon: 'assets/es6.svg'
            },
            {
                name: 'TypeScript',
                value: '5',
                icon: 'assets/typescript.svg'
            },
            {
                name: 'Java',
                value: '5',
                icon: 'assets/java.svg'
            },
            {
                name: 'C#',
                value: '4',
                icon: 'assets/c-sharp.svg'
            },
            {
                name: 'Python',
                value: '4',
                icon: 'assets/python.svg'
            },
            {
                name: 'C++',
                value: '3',
                icon: 'assets/c-plus.svg'
            },
            {
                name: 'C',
                value: '3',
                icon: 'assets/c.svg'
            },
            {
                name: 'Haskell',
                value: '2',
                icon: 'assets/haskell.svg'
            }
        ]
    },
    {
        title: 'Frameworks and libraries',
        type: 'percentage',
        items: [
            {
                name: 'Angular 6+',
                value: '95',
                icon: 'assets/angular.svg'
            },
            {
                name: 'Stencil.js',
                value: '90',
                icon: 'assets/stencil.svg'
            },
            {
                name: 'React',
                value: '80',
                icon: 'assets/react.svg'
            }
        ]
    },
    {
        title: 'Platforms and environments',
        type: 'percentage',
        items: [
            {
                name: 'Node.js',
                value: '90',
                icon: 'assets/node.svg'
            },
            {
                name: 'JEE',
                value: '70',
                icon: 'assets/java.svg'
            },
            {
                name: '.Net',
                value: '65',
                icon: 'assets/dot-net.svg'
            },
            {
                name: 'Django',
                value: '60',
                icon: 'assets/django.svg'
            }
        ]
    },
    {
        title: 'Database management systems',
        type: 'percentage',
        items: [
            {
                name: 'MongoDB',
                value: '80',
                icon: 'assets/mongodb.svg'
            },
            {
                name: 'MySQL',
                value: '70',
                icon: 'assets/mysql.svg'
            },
            {
                name: 'PostgreSQL',
                value: '60',
                icon: 'assets/postgresql.svg'
            },
            {
                name: 'SQL Server',
                value: '60',
                icon: 'assets/sqlserver.svg'
            }
        ]
    },
    {
        title: 'Graphics & Design',
        type: 'percentage',
        items: [
            {
                name: 'Inkscape',
                value: '90',
                icon: 'assets/inkscape.svg'
            },
            {
                name: 'A. Illustrator',
                value: '80',
                icon: 'assets/illustrator.svg'
            },
            {
                name: 'A. Photoshop',
                value: '60',
                icon: 'assets/photoshop.svg'
            },
            {
                name: 'Gimp',
                value: '50',
                icon: 'assets/gimp.svg'
            },
            {
                name: 'Sketch',
                value: '40',
                icon: 'assets/sketch.svg'
            },
        ]
    },
    {
        title: 'Markup languages',
        type: 'rating',
        items: [
            {
                name: 'HTML 5',
                value: '6',
                icon: 'assets/html.svg'
            },
            {
                name: 'XML',
                value: '5',
                icon: 'assets/xml.svg'
            },
            {
                name: 'Markdown',
                value: '5',
                icon: 'assets/markdown.svg'
            },
        ]
    },
    {
        title: 'Style sheet languages',
        type: 'rating',
        items: [
            {
                name: 'CSS3',
                value: '6',
                icon: 'assets/css.svg'
            },
            {
                name: 'Sass',
                value: '5',
                icon: 'assets/sass.svg'
            },
            {
                name: 'Less',
                value: '4',
                icon: 'assets/less.svg'
            },
        ]
    },
    {
        title: 'Typesetters',
        type: 'rating',
        items: [
            {
                name: 'LaTeX',
                value: '5',
                icon: 'assets/latex.svg'
            },
        ]
    },
    {
        title: 'Operating systems',
        type: 'rating',
        items: [
            {
                name: 'Mac OS X',
                value: '6',
                icon: 'assets/mac.svg'
            },
            {
                name: 'GNU/Linux',
                value: '5',
                icon: 'assets/linux.svg'
            },
            {
                name: 'MS Windows',
                value: '5',
                icon: 'assets/windows.svg'
            },
        ]
    },
];

export default class SkillsCard extends React.Component {

    render() {
        return (
            <Card fluid className={this.props.inputClassName}>
                <div ref={this.props.inputRef}></div>
                <Card.Content className='mobile hidden'>
                    <Card.Header><Icon name='terminal'/>Skills</Card.Header>
                </Card.Content>
                {skills.map((skill, j) =>
                    <Card.Content key={j}>
                        <Card.Meta>{skill.title}</Card.Meta>
                        <Table basic>
                            <Table.Body>
                                {
                                    skill.items.map((item, i) =>
                                        <Table.Row key={i}>
                                            <Table.Cell className='table-key'>
                                                <i className='icon'><img src={item['icon']}
                                                                         alt={`${item['name']} icon`}/></i>
                                                <strong> {item['name']}</strong>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {skill.type === 'rating' ?
                                                    <Rating defaultRating={item['value']} maxRating={6} size='huge'
                                                            className={`color--${this.getRatingColor(item['value'])}`}/>
                                                    :
                                                    <Progress percent={item['value']}
                                                              size='medium'
                                                              color={this.getPercentageColor(item['value'])} progress/>
                                                }
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                }
                            </Table.Body>
                        </Table>
                    </Card.Content>
                )}
            </Card>
        );
    }

    getPercentageColor(value) {
        return value >= 80 ? 'green' : 'blue';
    }

    getRatingColor(value) {
        return value >= 5 ? 'orange' : 'yellow';
    }

}
