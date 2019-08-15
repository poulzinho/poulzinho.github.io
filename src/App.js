import React, {Component} from 'react';
import './App.css';
import {Grid, Segment} from 'semantic-ui-react'
import PhotoCard from "./components/CV/PhotoCard/PhotoCard";
import HeaderMenu from "./components/CV/Header/HeaderMenu";
import AboutMe from "./components/CV/AboutMe/AboutMe";
import Experience from "./components/CV/Experience/Experience";
import SkillsCard from "./components/CV/SkillsCard/SkillsCard";
import Education from "./components/CV/Education/Education";
import Skills from "./components/CV/Skills/Skills";

class App extends Component {

    constructor(props) {    // Optional, declare a class field
        super(props);
        this.photoCardRef = React.createRef();
        this.aboutMeRef = React.createRef();
        this.experienceRef = React.createRef();
        this.educationRef = React.createRef();
        this.skillsRef = React.createRef();
        this.skillsCardRef = React.createRef();
    }

    render() {
        return (
            <React.Fragment>
                <Segment vertical className='layout-header'>
                    <HeaderMenu onSelected={this.goToSection}/>
                </Segment>

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
            </React.Fragment>
        )
    }

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
