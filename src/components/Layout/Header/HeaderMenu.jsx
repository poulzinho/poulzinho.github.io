import React from 'react'
import './HeaderMenu.css';
import {Menu, Segment} from 'semantic-ui-react'

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
    state = {activeItem: window.location.pathname};

    handleItemClick = (item) => {
        this.setState({activeItem: item.route});
        this.props.onSelected(item.route)
    };

    render() {
        const {activeItem} = this.state;
        return (
            <React.Fragment>
                <Segment inverted>
                    <Menu inverted pointing secondary>
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
