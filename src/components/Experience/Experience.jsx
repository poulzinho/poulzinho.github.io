import React from "react";
import {Card, Flag, Header, Icon, Image, Label, List} from "semantic-ui-react";

const experienceItems = [
    {
        header: 'SOFTWARE ENGINEER',
        client: 'Celonis SE',
        logo: 'assets/celonis.svg',
        nda: false,
        role: 'Frontend Architecture and Development',
        description: 'The Celonis Intelligent Business Cloud is the world’s first SaaS solution for supporting business transformation initiatives ' +
            'through process mining.',
        country: {
            code: 'de',
            place: 'Munich, Germany'
        },
        date: 'Feb 2019 - Present',
        projects: [{}],
        tags: [
            {tag: 'Angular 7', color: 'blue'},
            {tag: 'TypeScript', color: 'blue'},
            {tag: 'AngularJS', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'Jasmine', color: 'blue'},
            {tag: 'Karma', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'GIT', color: 'green'},
            {tag: 'Bitbucket', color: 'green'},
            {tag: 'JIRA', color: 'green'},
            {tag: 'Docker', color: 'green'},
            {tag: 'Kubernetes', color: 'green'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'TDD', color: 'grey'},
            {tag: 'E2E', color: 'grey'},
            {tag: 'Agile Development', color: 'grey'},
        ]
    },
    {
        header: 'FRONTEND ARCHITECT/DEVELOPER',
        client: 'Truck & Bus Group in Germany*',
        logo: 'assets/netlight.svg',
        nda: true,
        role: 'Consultant @ Netlight Consulting GmbH',
        description: 'As a Netlight Consultant, I supported the Financial Services of one of the biggest Truck & Bus Groups in Germany.',
        country: {
            code: 'de',
            place: 'Munich, Germany'
        },
        date: 'Oct 2018 - Jan 2019',
        projects: [{
            title: 'Point of Sale (PoS) platform',
            description: 'The goal was to develop a cloud-based Point of Sale (PoS) platform to offer financing options for vehicle purchases. To achieve that, it was necessary to build and adapt communication channels and interfaces with a number of the company’s legacy systems.',
            tasks: ['I joined the project as Angular Frontend Developer to support the team realizing a platform\n' +
            'for the company\'s leasing consultants to calculate loans, interest rates, generate offers and get an\n' +
            'overview of the past events with a certain customer.',
                'I applied cross-functional and agile working methods, and a modern Frontend technology stack aimed at developing new products faster.',
                'The aforementioned platform is currently in production.'
            ],
        }],
        tags: [
            {tag: 'Angular 6', color: 'blue'},
            {tag: 'TypeScript', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'Jasmine', color: 'blue'},
            {tag: 'Karma', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'Angular Material Design', color: 'teal'},
            {tag: 'GIT', color: 'green'},
            {tag: 'Bitbucket', color: 'green'},
            {tag: 'JIRA', color: 'green'},
            {tag: 'Docker', color: 'green'},
            {tag: 'Kubernetes', color: 'green'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'TDD', color: 'grey'},
            {tag: 'E2E', color: 'grey'},
            {tag: 'Agile Development', color: 'grey'},
        ]
    },
    {
        header: 'FRONTEND ARCHITECT/DEVELOPER',
        client: 'Digital Identity Startup*',
        logo: 'assets/netlight.svg',
        nda: true,
        role: 'Consultant @ Netlight Consulting GmbH',
        description: 'As a Netlight Consultant, I worked for a Munich based startup which aims at changing the paradigm of user\'s digital identity.',
        country: {
            code: 'de',
            place: 'Munich, Germany'
        },
        date: 'Jul 2018 - Oct 2018',
        projects: [{
            title: 'Digital Identity Framework and Ecosystem',
            description: 'My team developed a digital identity framework and ecosystem which includes a mobile application (Wallet), a web platform (Identity Terminal) a Core SDK, and a Trigger.',
            tasks: [
                'Primarily, I worked on the architecture and development of the Trigger, a universal JavaScript/TypeScript web component based on ionic/Stencil.js.',
                'This Trigger integrates easily with diverse frameworks and libraries such as Angular, React, Vue.js, and also with vanilla JavaScript SPAs.',
                'The Trigger component is currently in production, it launches the entire ecosystem and allows users to follow custom authentications workflows for different use cases where digital authentication is needed, such as age verification, package delivery, financial transactions, among others.'
            ],
        }],
        tags: [
            {tag: 'Stencil.js', color: 'blue'},
            {tag: 'Angular 6', color: 'blue'},
            {tag: 'React', color: 'blue'},
            {tag: 'TypeScript', color: 'blue'},
            {tag: 'Jest', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'ES6', color: 'blue'},
            {tag: 'Node.js', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'SVG', color: 'teal'},
            {tag: 'OAuth 2.0', color: 'green'},
            {tag: 'Implicit Flow', color: 'green'},
            {tag: 'JWT', color: 'green'},
            {tag: 'Bitbucket', color: 'green'},
            {tag: 'JIRA', color: 'green'},
            {tag: 'Jenkins', color: 'green'},
            {tag: 'Docker', color: 'green'},
            {tag: 'Kubernetes', color: 'green'},
            {tag: 'Google Cloud Platform', color: 'green'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'TDD', color: 'grey'},
            {tag: 'E2E', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
        ]
    },
    {
        header: 'GRAPHICS/UX DESIGNER',
        client: 'Netlight Consulting GmbH',
        logo: 'assets/netlight.svg',
        nda: false,
        role: 'Working Student',
        description: 'Netlight Consulting GmbH is an IT, innovation and management consultancy company. ' +
            'It employs more than 1000 talented individuals in Stockholm, Oslo, Helsinki, Copenhagen, Hamburg, Berlin, Munich and Zurich.',
        country: {
            code: 'de',
            place: 'Munich, Germany'
        },
        date: 'Jan 2018 - Mar 2018',
        projects: [{
            title: 'Graphics and UX Design',
            description: 'I joined Netlight as a Working Student for the Graphics and UX Design department.',
            tasks: [
                'I designed and implemented digital media and web designs for internal and external campaigns, employing ' +
                'state of the art technologies such as Adobe Illustrator, Photoshop, Sketch, Inkscape among others. ' +
                'Furthermore, I employed scripting programming languages for animation purposes.',
                'My team followed an agile user-centered design paradigm which promoted collaboration, knowledge sharing ' +
                'and enabled fast product delivery and acceptance.',
            ],
        }],
        tags: [
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'SVG', color: 'teal'},
            {tag: 'Adobe Illustrator', color: 'pink'},
            {tag: 'Adobe Photoshop', color: 'pink'},
            {tag: 'Inkscape', color: 'pink'},
            {tag: 'Sketch', color: 'pink'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'Graphic Design', color: 'orange'},
        ]
    },
    {
        header: 'FULL STACK DEVELOPER',
        client: 'Technical University of Munich (TUM)',
        logo: 'assets/tum.svg',
        nda: false,
        role: 'Working Student',
        description: 'The Technical University of Munich (TUM) is one of Europe’s top research-oriented universities\n' +
            'and is also cataloged as an entrepreneurial university because it cooperates closely with\n' +
            'industry partners.',
        country: {
            code: 'de',
            place: 'Munich, Germany'
        },
        date: 'Oct 2016 - Jan 2018',
        projects: [{
            title: 'Contextual Email Client',
            description: 'The chair of Software Engineering for Business Information Systems (SEBIS) at\n' +
                'TUM is doing active research on how employees manage emails, extract tasks and keep track of their\n' +
                'progress in the corporate context. These emails usually contain knowledge, commands, and\n' +
                'tasks requiring actions that may be vital for a company.\n' +
                'Since the manual extraction of these tasks is time-consuming and error-prone, and due to the\n' +
                'lack of tools for the automatic, intelligent extraction of this contextual information and posterior\n' +
                'integration with third-party task management systems, SEBIS required the design and\n' +
                'development of such tool.',
            tasks: [
                'I took the role of a full-stack developer and led an agile cross-functional development team\n' +
                'in order to build a suitable solution. ',
                'The role included the requirement analysis, design, development, and testing of the front-end and back-end of a scalable Contextual Email Client,\n' +
                'that on its release supported the major email providers, Gmail and Exchange, and seamlessly\n' +
                'integrated with third-party task management systems such as Trello and SocioCortex.'
            ],
        }],
        tags: [
            {tag: 'Angular 4', color: 'blue'},
            {tag: 'Angular Material Design', color: 'blue'},
            {tag: 'D3.js', color: 'blue'},
            {tag: 'Cytoscape', color: 'blue'},
            {tag: 'jQuery', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'TypeScript', color: 'blue'},
            {tag: 'Mocha', color: 'blue'},
            {tag: 'Chai', color: 'blue'},
            {tag: 'Isparta', color: 'blue'},
            {tag: 'ES6', color: 'blue'},
            {tag: 'Node.js', color: 'blue'},
            {tag: 'Express.js', color: 'blue'},
            {tag: 'MongoDB', color: 'blue'},
            {tag: 'Mongoose.js', color: 'blue'},
            {tag: 'Socket.io', color: 'blue'},
            {tag: 'Passport.js', color: 'blue'},
            {tag: 'Bluebird', color: 'blue'},
            {tag: 'Nodemailer', color: 'blue'},
            {tag: 'Mailparser', color: 'blue'},
            {tag: 'node-EWS', color: 'blue'},
            {tag: 'Natural Language Processing', color: 'blue'},
            {tag: 'NLP', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'Flex', color: 'teal'},
            {tag: 'Sass', color: 'teal'},
            {tag: 'IMAP', color: 'green'},
            {tag: 'OAuth 2.0', color: 'green'},
            {tag: 'Docker', color: 'green'},
            {tag: 'GIT', color: 'green'},
            {tag: 'GitHub', color: 'green'},
            {tag: 'GitLab', color: 'green'},
            {tag: 'Jenkins', color: 'green'},
            {tag: 'Adobe Illustrator', color: 'pink'},
            {tag: 'Inkscape', color: 'pink'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'Agile', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
        ]
    },
    {
        header: 'SOFTWARE DEVELOPER',
        client: 'Escuela Politécnica Nacional (EPN)',
        logo: 'assets/epn.svg',
        nda: false,
        role: 'Full-Time Employee',
        description: 'Established in 1869, The Escuela Politécnica Nacional (EPN) is Ecuador\'s top university for\n' +
            'science and engineering. The faculty of Systems Engineering does active research on Natural\n' +
            'Language Processing (NLP) in the context of scientific writing.',
        country: {
            code: 'ec',
            place: 'Quito, Ecuador'
        },
        date: 'Jun 2014 - Jun 2015',
        projects: [{
            title: 'Annotation Tool',
            description: 'The Natural Language Processing (NLP) research group needed a tool for annotating text corpus aimed at posterior natural\n' +
                'language processing and machine learning. Such text corpus consists of scientific papers in\n' +
                '*.pdf and *.txt format. They required a tool that allowed international collaborators to annotate\n' +
                'the scientific papers remotely and through a web browser.',
            tasks: [
                'As a software developer, I collected the requirements for the annotation tool,\n' +
                'designed, developed and tested several low and high-fidelity prototypes taking into account a\n' +
                'positive user experience in every stage. ',
                'The released solution was highly appreciated by the\n' +
                'NLP research team and enabled the expansion of its text corpus.'
            ],
        }],
        tags: [
            {tag: 'AngularJS', color: 'blue'},
            {tag: 'jQuery', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'TypeScript', color: 'blue'},
            {tag: 'Java', color: 'blue'},
            {tag: 'JUnit', color: 'blue'},
            {tag: 'JEE', color: 'blue'},
            {tag: 'C++', color: 'blue'},
            {tag: 'C', color: 'blue'},
            {tag: 'Natural Language Processing', color: 'blue'},
            {tag: 'NLP', color: 'blue'},
            {tag: 'Apache OpenNLP', color: 'blue'},
            {tag: 'MySQL', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'Flex', color: 'teal'},
            {tag: 'Sass', color: 'teal'},
            {tag: 'Glassfish', color: 'green'},
            {tag: 'Maven', color: 'green'},
            {tag: 'GIT', color: 'green'},
            {tag: 'Jenkins', color: 'green'},
            {tag: 'Inkscape', color: 'pink'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'Agile', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
        ]
    },
    {
        header: 'SOFTWARE DEVELOPER',
        client: 'Weatherford South America LLC',
        logo: 'assets/wft.svg',
        nda: false,
        role: 'Intern',
        description: 'Weatherford is one of the world\'s largest multinational oil and gas service companies.\n' +
            'Headquartered in Switzerland, Weatherford operates in more than 100 countries across the\n' +
            'globe and employs more than 40,000 people.',
        country: {
            code: 'ec',
            place: 'Quito, Ecuador'
        },
        date: 'May 2012 - Feb 2013',
        projects: [{
            title: 'IT Academy',
            description: 'Successful Weatherford operations and expansion in Ecuador incremented the hiring rate and\n' +
                'as a consequence the need for employees training, particularly in IT technologies. Weatherford Ecuador required a migration and adaptation of training material from legacy systems to\n' +
                'recently acquired Microsoft technologies that should be available to personnel in different\n' +
                'regions of the country.',
            tasks: [
                'I designed and developed an internal e-Learning system integrated with a web-based\n' +
                'collaborative platform that allowed employees to share IT knowledge. ',
                'Weatherford highly praised the Ecuadorian solution and promoted its usage in other South American countries.'
            ],
        }],
        tags: [
            {tag: 'C#', color: 'blue'},
            {tag: '.NET', color: 'blue'},
            {tag: 'ASP', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'SQL Server', color: 'green'},
            {tag: 'NuGet', color: 'green'},
            {tag: 'Team Foundation Server', color: 'green'},
            {tag: 'Microsoft Visual Studio', color: 'green'},
            {tag: 'Microsoft SharePoint', color: 'green'},
            {tag: 'Inkscape', color: 'pink'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'Agile', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
        ]
    },
    {
        header: 'SOFTWARE DEVELOPER',
        client: 'Insumedical',
        logo: 'assets/insumedical.svg',
        nda: false,
        role: 'Junior Software Developer, Intern',
        description: 'Insumedical is a Latin American business-to-business (B2B) company that imports,\n' +
            'manufactures and distributes medical supplies, devices, equipment, and healthcare products to\n' +
            'hospitals, clinics, and care centers.',
        country: {
            code: 'ec',
            place: 'Quito, Ecuador'
        },
        date: 'Jun 2009 - Apr 2012',
        projects: [{
            title: 'B2C e-Commerce',
            description: 'Attempting forward vertical integration as part of its expansion strategy and in order to study\n' +
                'the feasibility and effects of becoming an online retailer, Insumedical required the development\n' +
                'of a prototype for a business-to-consumer (B2C) e-commerce tailored to the Ecuadorian market.',
            tasks: [
                'In the role of software developer and UX designer, I designed and developed low and high fidelity\n' +
                'prototypes in an iterative and incremental way considering the culture and behavior of\n' +
                'Ecuadorian consumers. ',
                'Moreover, I combined Scrum and UX into an agile\n' +
                'software development methodology enabling the simultaneous work of designers and\n' +
                'developers.',
                'Insumedical was satisfied with the delivered prototype and studied the effects of\n' +
                'extending from B2B to B2C.'
            ],
        }],
        tags: [
            {tag: 'jQuery', color: 'blue'},
            {tag: 'JavaScript', color: 'blue'},
            {tag: 'Java', color: 'blue'},
            {tag: 'JUnit', color: 'blue'},
            {tag: 'JEE', color: 'blue'},
            {tag: 'PostgreSQL', color: 'blue'},
            {tag: 'JSON', color: 'teal'},
            {tag: 'HTML', color: 'teal'},
            {tag: 'CSS', color: 'teal'},
            {tag: 'Glassfish', color: 'green'},
            {tag: 'Maven', color: 'green'},
            {tag: 'GIT', color: 'green'},
            {tag: 'Heroku', color: 'green'},
            {tag: 'Jenkins', color: 'green'},
            {tag: 'Inkscape', color: 'pink'},
            {tag: 'UX Design', color: 'orange'},
            {tag: 'Agile', color: 'grey'},
            {tag: 'Scrum', color: 'grey'},
        ]
    },
];

export default class Experience extends React.Component {

    render() {
        return (
            <div ref={this.props.inputRef} className='grid-row'>
                <Header as='h3'><Icon name='briefcase'/> Experience</Header>
                {experienceItems.map((experience, i) =>
                    <Card fluid key={i}>
                        <Card.Content>
                            <Image floated='right' size='mini' src={experience['logo']} />
                            <Card.Header>
                                <Header as='h2' className='card-header-title'>
                                    {experience['header']}
                                </Header>
                                <Header as='h3' className='card-header-title'>
                                    {experience['client']}
                                    <Header.Subheader>
                                        {experience['role']}
                                    </Header.Subheader>
                                </Header>
                            </Card.Header>

                            <Card.Meta>
                                <List>
                                    <List.Item className='cell-country'>
                                        <Flag name={experience['country']['code']}/>
                                        <p>{experience['country']['place']}</p>
                                    </List.Item>
                                    <List.Item className='cell-date'>
                                        <Icon name='calendar check outline'/>
                                        {experience['date']}
                                    </List.Item>
                                </List>
                            </Card.Meta>

                            <Card.Description>
                                {experience['description']}
                            </Card.Description>

                        </Card.Content>

                        <Card.Content>
                            {experience['projects'].map((project, j) =>
                                (
                                    <React.Fragment key={j}>
                                        <Header as='h5'>{project['title']}</Header>
                                        <Card.Description>
                                            <p>{project['description']}</p>
                                            {
                                                project['tasks'] ?
                                                    <List bulleted>
                                                        {project['tasks'].map((task, k) => <List.Item
                                                            key={k}>{task}</List.Item>)}
                                                    </List> : ''
                                            }
                                        </Card.Description>
                                    </React.Fragment>
                                )
                            )}
                        </Card.Content>

                        <Card.Content extra>
                            <Label.Group size='tiny'>
                                {experience['tags'].map((tag, l) =>
                                    <Label as='a' basic color={tag['color']} key={l}>
                                        {tag['tag']}
                                    </Label>)}
                            </Label.Group>
                            {
                                experience['nda'] ?
                                    <div className='nda'>* Client name protected by a Non-Disclosure
                                        Agreement.</div> : ''
                            }
                        </Card.Content>
                    </Card>
                )}
            </div>
        )
    }

};

