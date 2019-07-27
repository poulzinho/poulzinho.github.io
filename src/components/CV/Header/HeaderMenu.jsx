import React from 'react'
import './HeaderMenu.css';
import {Container, Header, Icon, Step} from 'semantic-ui-react'
import {Highlighter} from "../../../core/Highlighter/Highlighter";

const headerMenu = [
    {
        title: 'Basic Info',
        icon: 'info',
        route: 'BasicInfo'
    },
    {
        title: 'About me',
        icon: 'address card outline',
        route: 'AboutMe'
    },
    {
        title: 'Experience',
        icon: 'briefcase',
        route: 'Experience'
    },
    {
        title: 'Education',
        icon: 'graduation',
        route: 'Education'
    },
    {
        title: 'Skills',
        icon: 'terminal',
        route: 'SkillsCard'
    },
];

export default class HeaderMenu extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Container className='header-container mobile hidden'>

                    <Header as='h5' className='main-header'>
                        <div className='logo icon'></div>
                        <Header.Content>
                        <span className='main-header--title'>
                        PAUL GUALOTUNA
                        </span>
                            {/*eslint-disable */}
                            <Highlighter>
                                {'((x = \'Software Developer\', y = \'UX Designer\') => alert(`${x} && ${y}`))();'}
                            </Highlighter>
                            {/*eslint-enable */}
                        </Header.Content>
                    </Header>


                    <Step.Group fluid className='mobile hidden no-print'>
                        {
                            headerMenu.map((item, i) =>
                                <Step key={i} onClick={() => this.props.onSelected(item.route)}>
                                    <Icon name={item.icon}/>
                                    <Step.Content>
                                        <Step.Title>{item.title}</Step.Title>
                                    </Step.Content>
                                </Step>
                            )
                        }
                    </Step.Group>
                </Container>
                <Container className='mobile only no-print'>
                    <Header textAlign='center'>
                        Have a wonderful 2019!
                        <Header.Subheader>Happy Coding...</Header.Subheader>
                    </Header>
                </Container>
            </React.Fragment>
        )
    }

}
