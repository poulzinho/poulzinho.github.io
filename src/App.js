import React, {Component} from 'react';
import './App.css';
import {
    Container,
    Grid,
    Header,
    Icon,
    Menu,
    Segment,
    Sidebar,
    Sticky
} from 'semantic-ui-react'
import PhotoCard from "./components/CV/PhotoCard/PhotoCard";
import HeaderMenu from "./components/CV/Header/HeaderMenu";
import AboutMe from "./components/CV/AboutMe/AboutMe";
import Experience from "./components/CV/Experience/Experience";
import SkillsCard from "./components/CV/SkillsCard/SkillsCard";
import Education from "./components/CV/Education/Education";
import Skills from "./components/CV/Skills/Skills";
import SidebarMenu from "./components/CV/Sidebar/SidebarMenu";

class App extends Component {

    state = {
        visible: false
    };

    constructor(props) {    // Optional, declare a class field
        super(props);
        this.photoCardRef = React.createRef();
        this.aboutMeRef = React.createRef();
        this.experienceRef = React.createRef();
        this.educationRef = React.createRef();
        this.skillsRef = React.createRef();
        this.skillsCardRef = React.createRef();
    }

    handleShowClick = () => this.setState({visible: true});
    handleHideClick = () => this.setState({visible: false});
    handleSidebarHide = () => this.setState({visible: false});

    handleStickyContextRef = contextRef => this.setState({contextRef});

    render() {

        const {contextRef, visible} = this.state;

        return (
            <div>
                <Sticky context={contextRef} className='mobile only' offset={1}>
                    <Segment className='no-print header-menu--mobile'>
                        <Header as='h6'>
                            <Icon
                                onClick={this.handleShowClick}
                                name='bars'
                                className='mobile-toggle'
                                style={!visible ? {} : {display: 'none'}}
                            />
                            <Icon
                                onClick={this.handleHideClick}
                                name='bars'
                                className='mobile-toggle'
                                style={visible ? {} : {display: 'none'}}
                            />
                            <Header.Content>
                                <span className='main-header--title'>
                                    PAUL GUALOTUNA
                                </span>
                            </Header.Content>
                        </Header>
                    </Segment>
                </Sticky>

                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.handleSidebarHide}
                        target={this.segmentRef}
                        vertical
                        visible={visible}
                        width='thin'
                        className='mobile only'
                    >
                        <SidebarMenu onSelected={this.hideSidebarAndGoToSection}/>
                    </Sidebar>

                    <Sidebar.Pusher onClick={() => {
                    }}>
                        <div ref={this.handleStickyContextRef}>
                            <Segment vertical className='layout-header'>
                                <HeaderMenu onSelected={this.goToSection}/>
                            </Segment>

                            <Container className='layout-content' textAlign='justified'>
                                <Grid stackable columns={2}>
                                    <Grid.Column width={6}>
                                        <PhotoCard inputRef={el => this.photoCardRef = el}/>
                                        <Education inputRef={el => this.educationRef = el}/>
                                        <SkillsCard inputRef={el => this.skillsCardRef = el} inputClassName='mobile hidden'/>
                                    </Grid.Column>
                                    <Grid.Column width={10}>
                                        <AboutMe inputRef={el => this.aboutMeRef = el}/>
                                        <Experience inputRef={el => this.experienceRef = el}/>
                                        <Skills inputRef={el => this.skillsRef = el}/>
                                    </Grid.Column>
                                </Grid>
                            </Container>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }

    hideSidebarAndGoToSection = (section) => {
        this.setState({visible: false});
        this.goToSection(section, 83);
    };

    goToSection = (section, topMargin = 0) => {

        window.scroll({
            top: 0,
            behavior: 'auto'
        });

        window.scroll({
            top: topMargin,
            behavior: 'auto'
        });

        /*eslint-disable */
        let goToRef;
        /*eslint-enable*/

        switch (section) {
            case 'AboutMe': {
                this.goToRef = this.aboutMeRef;
                break;
            }
            case 'Experience': {
                this.goToRef = this.experienceRef;
                break;
            }
            case 'Education': {
                this.goToRef = this.educationRef;
                break;
            }
            case 'Skills': {
                this.goToRef = this.skillsRef;
                break;
            }
            case 'SkillsCard': {
                this.goToRef = this.skillsCardRef;
                break;
            }
            default: {
                this.goToRef = this.photoCardRef;
                break;
            }
        }

        window.scroll({
            top: (this.goToRef.getBoundingClientRect().top),
            behavior: 'auto'
        })
    }
}

export default App;
