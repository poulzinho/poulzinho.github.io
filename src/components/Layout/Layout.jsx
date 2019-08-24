import React, {Component} from 'react';
import './Layout.css';
import {Container, Menu, Sidebar} from 'semantic-ui-react'
import HeaderMenu from "./Header/HeaderMenu";
import SidebarMenu from "./Sidebar/SidebarMenu";
import {withRouter} from 'react-router-dom'
import {goToRef} from "../../core/Utils/Utils";
import {withGlobalState} from "react-globally";

class Layout extends Component {

    state = {};

    handleStickyContextRef = contextRef => this.setState({contextRef});

    render() {
        return (
            <React.Fragment>
                <HeaderMenu onSelected={this.goToSection}
                            onShowSidebar={this.showSidebar}
                            onHideSidebar={this.hideSidebar}/>
                <Sidebar.Pushable>
                    <Sidebar
                        as={Menu}
                        animation='overlay'
                        icon='labeled'
                        inverted
                        onHide={this.hideSidebar}
                        target={this.segmentRef}
                        vertical
                        visible={this.props.globalState.sidebarActive}
                        width='thin'
                        className='mobile only'
                    >
                        <SidebarMenu onSelected={this.hideSidebarAndGoToRef}/>
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

    hideSidebar = () => {
        this.props.setGlobalState(() => ({sidebarActive: false}));
    };

    showSidebar = () => {
        this.props.setGlobalState(() => ({sidebarActive: true}));
    };

    hideSidebarAndGoToRef = (ref) => {
        this.hideSidebar();
        goToRef(ref);
    };

    goToSection = (section) => {
        this.props.history.push(section);
    }
}

export default withRouter(withGlobalState(Layout));