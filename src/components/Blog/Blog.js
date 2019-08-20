import React from 'react'
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Icon, Item} from "semantic-ui-react";
import {withGlobalState} from "react-globally";
import {formatDate} from "../../core/Utils/Utils";

class Blog extends React.Component {

    postPath = '/blog/post/';

    goToPost = (slug) => {
        this.props.history.push(`${this.postPath}${slug}`);
    };

    componentDidMount() {
        this.props.setGlobalState(() => ({
            sidebarItems: []
        }));
    }

    render() {
        const data = this.props.data;
        if (data.loading) {
            return <div>Loading blog...</div>
        } else {
            return <div>
                <Item.Group divided link>
                    {
                        data.posts.map((post, i) =>
                            <Item key={i} onClick={() => this.goToPost(post.slug)}>
                                <Item.Image size='small' src={post.image}/>

                                <Item.Content>
                                    <Item.Header>{post.title}</Item.Header>
                                    <Item.Meta>
                                        <Icon name='calendar alternate outline'/> {formatDate(post.date)}
                                    </Item.Meta>
                                    <Item.Description>{post.summary}</Item.Description>
                                </Item.Content>
                            </Item>
                        )
                    }
                </Item.Group>
            </div>
        }
    }
}

const allPosts = gql`
  query allPosts {
    posts {
        id
        slug
        date
        title
        image
        summary
    }
  }
`;

export default graphql(allPosts)(withGlobalState(Blog));
