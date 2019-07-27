import React, {Component} from 'react'
import {Icon, Menu} from 'semantic-ui-react'

const headerMenu = [
    {
        title: 'Basic info',
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
        route: 'Skills'
    }
];

export default class SidebarMenu extends Component {

    render() {
        return (
            <React.Fragment>
                {
                    headerMenu.map((item, i) =>
                        <Menu.Item as='a' key={i} onClick={() => this.props.onSelected(item.route)}>
                            <Icon name={item.icon}/>
                            {item.title}
                        </Menu.Item>
                    )
                }
            </React.Fragment>
        )
    }

}
