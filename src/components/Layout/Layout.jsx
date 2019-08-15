import React, {Component} from 'react';
import '../../App.css';
import {Container, Menu, Sidebar, Sticky} from 'semantic-ui-react'
import HeaderMenu from "./Header/HeaderMenu";
import SidebarMenu from "./Sidebar/SidebarMenu";
import {withRouter} from 'react-router-dom'

class Layout extends Component {

    state = {
        visibleSidebar: false
    };

    showSidebar = () => this.setState({visibleSidebar: true});
    hideSidebar = () => this.setState({visibleSidebar: false});

    handleStickyContextRef = contextRef => this.setState({contextRef})

    render() {

        const {contextRef, visibleSidebar} = this.state;
        return (
            <React.Fragment>
                <Sticky context={contextRef} offset={1}>
                    <HeaderMenu
                        onSelected={this.goToSection}
                        onBurguerClick={(active) => active ? this.showSidebar() : this.hideSidebar()}/>
                </Sticky>

                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.hideSidebar}
                        target={this.segmentRef}
                        vertical
                        visible={visibleSidebar}
                        width='thin'
                        className='mobile only'
                    >
                        <SidebarMenu onSelected={this.hideSidebarAndGoToSection}/>
                    </Sidebar>

                    <Sidebar.Pusher onClick={() => {
                    }}>
                        <div ref={this.handleStickyContextRef}>
                            <Container className='layout-content' textAlign='justified'>
                                {this.props.children}
                            </Container>
                        </div>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </React.Fragment>
        )
    }

    hideSidebarAndGoToSection = (section) => {
        this.hideSidebar();
        this.goToSection(section);
    };

    goToSection = (section) => {
        this.props.history.push(section);
    }
}

export default withRouter(Layout);