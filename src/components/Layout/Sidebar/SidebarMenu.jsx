import React, {Component} from 'react'
import {Icon, Menu} from 'semantic-ui-react'
import {withGlobalState} from "react-globally";

class SidebarMenu extends Component {
    render() {
        const sidebarItems = this.props.globalState.sidebarItems;
        return (
            <React.Fragment>
                {
                    sidebarItems.map((item,i) =>
                        <Menu.Item as='a' key={i} onClick={() => this.props.onSelected(item.ref)}>
                            <Icon name={item.icon}/>
                            {item.title}
                        </Menu.Item>
                    )
                }

            </React.Fragment>
        )
    }
}

export default withGlobalState(SidebarMenu);
