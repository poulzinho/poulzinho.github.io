import React from 'react'
import './HeaderMenu.css';
import {Icon, Menu, Segment} from 'semantic-ui-react'
import {withGlobalState} from "react-globally";

const headerMenu = [
    {
        title: 'Home',
        route: '/'
    },
    {
        title: 'Blog',
        route: '/blog'
    }
];

class HeaderMenu extends React.Component {
    state = {
        activeItem: window.location.pathname,
    };

    handleItemClick = (item) => {
        this.setState({activeItem: item.route});
        this.props.onSelected(item.route);
    };

    render() {
        const {activeItem} = this.state;
        const {sidebarActive} = this.props.globalState;
        return (
            <React.Fragment>
                <Segment inverted className='no-print header-menu'>
                    <Menu inverted secondary>
                        <Menu.Item className='mobile only'>
                            <Icon
                                onClick={() => this.props.onShowSidebar()}
                                name='bars'
                                className='mobile-toggle'
                                style={!sidebarActive ? {} : {display: 'none'}}
                            />
                            <Icon
                                onClick={() => this.props.onHideSidebar()}
                                name='bars'
                                className='mobile-toggle'
                                style={sidebarActive ? {} : {display: 'none'}}
                            />
                        </Menu.Item>
                        {
                            headerMenu.map((item, i) =>
                                <Menu.Item
                                    key={i}
                                    onClick={() => this.handleItemClick(item)}
                                    name={item.title}
                                    active={activeItem === item.route}
                                />
                            )
                        }
                    </Menu>
                </Segment>
            </React.Fragment>
        )
    }
}

export default withGlobalState(HeaderMenu);
