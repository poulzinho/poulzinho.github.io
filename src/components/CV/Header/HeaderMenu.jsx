import React from 'react'
import './HeaderMenu.css';
import {Button, Container, Header, Icon} from 'semantic-ui-react'

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
                <Container className='header-container'>
                    <Header as='h5' className='main-header'>
                        <div className='logo icon mobile hidden'></div>
                        <Header.Content>
                            <span className='main-header__title'>PAUL GUALOTUNA</span>
                            <p className='main-header__subtitle'>Software Engineer & UX Designer</p>
                        </Header.Content>
                    </Header>

                    <Button.Group fluid className='menu-container mobile hidden no-print'>
                        {
                            headerMenu.map((item, i) =>
                                <Button key={i} onClick={() => this.props.onSelected(item.route)} size='huge' basic>
                                    <Icon name={item.icon}/>
                                    {item.title}
                                </Button>
                            )
                        }
                    </Button.Group>
                </Container>
            </React.Fragment>
        )
    }

}
