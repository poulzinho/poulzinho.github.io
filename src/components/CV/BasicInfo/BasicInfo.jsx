import React from 'react'
import './BasicInfo.css';
import {Card, Flag, Header, Icon, Table} from 'semantic-ui-react'

const basicInfoData = [
    {
        title: 'Personal Data',
        items: [
            {
                key: 'Residence:',
                value: 'Munich, Germany.',
                icon: 'map marker'
            },
            {
                key: 'Birth:',
                value: '20.04.1987',
                icon: 'birthday'
            },
            {
                key: 'Nationality:',
                value: 'Ecuadorian.',
                icon: 'flag'
            },
            {
                key: 'Civil status:',
                value: 'Single.',
                icon: 'address card'
            },
        ]
    },
    {
        title: 'Contact',
        items: [
            {
                key: 'Mobile:',
                value: '(+49) 176 2273 7622',
                link: 'tel:+4917622737622',
                icon: 'mobile',
                hidden: true
            },
            {
                key: 'Email:',
                value: 'paul.gualotuna.dev (at) gmail.com',
                link: 'mailto:paul.gualotuna.dev@gmail.com?subject=Job Opportunity',
                icon: 'mail'
            },
            {
                key: 'Web:',
                value: 'www.gualotuna.com',
                link: 'https://www.gualotuna.com/',
                icon: 'at'
            },
        ]
    },
    {
        title: 'Social Networks',
        items: [
            {
                key: 'LinkedIn:',
                value: '/paul-gualotuna',
                link: 'https://www.linkedin.com/in/paul-gualotuna/?locale=en_US',
                icon: 'linkedin'
            },
            {
                key: 'Xing:',
                value: '/paul_gualotuna',
                link: 'https://www.xing.com/profile/Paul_Gualotuna/cv',
                icon: 'xing'
            },
            {
                key: 'Facebook:',
                value: '/paul.gualotuna',
                link: 'https://www.facebook.com/paul.gualotuna',
                icon: 'facebook'
            },
        ]
    },
    {
        title: 'Repositories',
        items: [
            {
                key: 'GitHub:',
                value: '/poulzinho',
                link: 'https://github.com/poulzinho',
                icon: 'github'
            },
        ]
    },
    {
        title: 'Languages',
        items: [
            {
                key: 'English',
                value: 'Fluent',
                flag: 'uk'
            },
            {
                key: 'Spanish',
                value: 'Native',
                flag: 'es'
            },
            {
                key: 'German',
                value: 'Beginner',
                flag: 'de'
            }
        ]
    }
];

export default class BasicInfo extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div ref={this.props.inputRef}></div>
                <Header as='h3'><Icon name='info'/> Basic info</Header>
                <Card fluid>
                    {
                        basicInfoData.map((data, j) =>
                            <React.Fragment key={j}>
                                <Card.Content>
                                    <Card.Meta>{data.title}</Card.Meta>
                                    <Table basic>
                                        <Table.Body>
                                            {data.items.map((item, i) =>
                                                <Table.Row key={i} className={item.hidden ? 'hidden-element' : ''}>
                                                    <Table.Cell className='table-key'>
                                                        {item.icon ? <Icon name={item.icon}/> :
                                                            <Flag name={item.flag}/>
                                                        }
                                                        <strong>{item.key}</strong>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {item.link ?
                                                            <a href={item.link} target="_blank"
                                                               rel="noopener noreferrer">{item.value}
                                                            </a>
                                                            : item.value}
                                                    </Table.Cell>
                                                </Table.Row>
                                            )}
                                        </Table.Body>
                                    </Table>
                                </Card.Content>
                            </React.Fragment>
                        )
                    }
                </Card>
            </React.Fragment>
        );
    }
}
