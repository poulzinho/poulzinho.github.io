import React from "react";
import {Header, Icon} from "semantic-ui-react";

export default class AboutMe extends React.Component {

    render() {
        return (
            <div ref={this.props.inputRef} className='grid-row'>
                <Header as='h3'><Icon name='address card outline'/>About me</Header>
                <p>I am a Full Stack Software Developer enthusiastic about programming languages
                    such as JavaScript (ES6+, TypeScript), Java, C#, among others, and with experience in different
                    frameworks and libraries, including Angular 6+, React, JEE, .Net.
                    Furthermore, I am also a graphic designer passionate about building up user-oriented interfaces
                    & UX that supports customer and business needs.
                    This is a result of being raised and educated in an artistic
                    and scientific environment, where I learned to balance and combine both of my competencies into
                    the development of innovative technology solutions.
                </p>
                <p>

                    I am also a cross-functional team player, and my skills had evolved in a broad spectrum of industries
                    such as
                    finance, medical supply, e-commerce, oil & gas, e-learning, and the academia.
                    According to my clients, my major strength is the talent to solve problems employing creative
                    approaches,
                    complemented with the drive to share knowledge empowering people around me.
                </p>
            </div>
        );
    }

}
