import React, {Component} from 'react';
import '../../App.css';
import {Container, Header, Icon, Menu, Segment, Sidebar, Sticky} from 'semantic-ui-react'
import HeaderMenu from "./Header/HeaderMenu";
import SidebarMenu from "./Sidebar/SidebarMenu";
import {
    withRouter
} from 'react-router-dom'

class Layout extends Component {

    state = {
        visible: false
    };

    constructor(props) {    // Optional, declare a class field
        super(props);
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
                            <HeaderMenu onSelected={this.goToSection}/>
                            <Container className='layout-content' textAlign='justified'>
                                {this.props.children}
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

    goToSection = (section) => {
        this.props.history.push(section);
    }
}

export default withRouter(Layout);