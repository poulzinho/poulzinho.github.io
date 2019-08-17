import React, {Component} from 'react';
import './App.css';
import {withGlobalState} from "react-globally";
import {Button, Card, Container, Grid, Header, Icon, Image} from 'semantic-ui-react'
import {goToRef} from "./core/Utils/Utils";
import BasicInfo from "./components/CV/PhotoCard/BasicInfo";
import AboutMe from "./components/CV/AboutMe/AboutMe";
import Experience from "./components/CV/Experience/Experience";
import Education from "./components/CV/Education/Education";
import Skills from "./components/CV/Skills/Skills";

class App extends Component {

    navItems = [];

    constructor(props) {    // Optional, declare a class field
        super(props);
        this.photoCardRef = React.createRef();
        this.aboutMeRef = React.createRef();
        this.experienceRef = React.createRef();
        this.educationRef = React.createRef();
        this.skillsCardRef = React.createRef();
        this.skillsRef = React.createRef();
    }

    componentDidMount() {
        const navItems = [
            {
                title: 'Basic info',
                icon: 'info',
                ref: this.photoCardRef
            },
            {
                title: 'About me',
                icon: 'address card outline',
                ref: this.aboutMeRef
            },
            {
                title: 'Experience',
                icon: 'briefcase',
                ref: this.experienceRef
            },
            {
                title: 'Education',
                icon: 'graduation',
                ref: this.educationRef
            },
        ];

        this.props.setGlobalState(() => ({
            sidebarItems: [
                ...navItems,
                {
                    title: 'Skills',
                    icon: 'terminal',
                    ref: this.skillsRef
                }
            ]
        }));

        this.navItems = [
            ...navItems,
            {
                title: 'Skills',
                icon: 'terminal',
                ref: this.skillsCardRef
            }
        ];
    }

    render() {
        return (
            <React.Fragment>
                <Header as='h5' className='main-header'>
                    <div className='logo icon'></div>
                    <Header.Content>
                        <span className='main-header__title'>PAUL GUALOTUNA</span>
                        <p className='main-header__subtitle'>Software Engineer & UX Designer</p>
                    </Header.Content>
                </Header>

                <Button.Group fluid className='menu-container mobile hidden no-print'>
                    {
                        this.navItems.map((item, i) =>
                            <Button key={i} onClick={() => goToRef(item.ref)} size='huge' basic>
                                <Icon name={item.icon}/>
                                {item.title}
                            </Button>
                        )
                    }
                </Button.Group>

                <Grid stackable columns={2}>
                    <Grid.Column width={6}>
                        <Card fluid>
                            <Image src='./assets/photo-card.jpg'/>
                        </Card>
                        <BasicInfo inputRef={el => this.photoCardRef = el}/>
                        <Education inputRef={el => this.educationRef = el}/>
                        <Skills inputRef={el => this.skillsCardRef = el} inputClassName='hallo mobile hidden'/>
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <AboutMe inputRef={el => this.aboutMeRef = el}/>
                        <Experience inputRef={el => this.experienceRef = el}/>
                        <Skills inputRef={el => this.skillsRef = el} inputClassName='mobile only'/>
                    </Grid.Column>
                </Grid>
            </React.Fragment>
        )
    }
}

export default withGlobalState(App);
