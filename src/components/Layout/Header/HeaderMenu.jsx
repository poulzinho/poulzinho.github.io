import React from 'react'
import './HeaderMenu.css';
import {Icon, Menu, Segment} from 'semantic-ui-react'

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

export default class HeaderMenu extends React.Component {
    state = {
        activeItem: window.location.pathname,
        activeBurguer: false
    };

    handleItemClick = (item) => {
        this.setState({activeItem: item.route});
        this.props.onSelected(item.route);
    };

    handleBurguerClick = () => {
        this.setState({activeBurguer: !this.state.activeBurguer}, () => {
            this.props.onBurguerClick(this.state.activeBurguer);
        });
    };

    render() {
        const {activeItem} = this.state;
        return (
            <React.Fragment>
                <Segment inverted className='no-print'>
                    <Menu inverted secondary>
                        <Menu.Item className='mobile only'>
                            <Icon
                                onClick={() => this.handleBurguerClick()}
                                name='bars'
                                className='mobile-toggle'
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
