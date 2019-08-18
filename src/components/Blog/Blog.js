import React from 'react'
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';
import {Item} from "semantic-ui-react";
import {withGlobalState} from "react-globally";

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
                <h1>All entries</h1>
                <Item.Group divided>
                    {
                        data.posts.map((post, i) =>
                            <Item key={i} onClick={() => this.goToPost(post.slug)}>
                                <Item.Image size='small' src='./assets/photo-card.jpg'/>
                                <Item.Content>
                                    <Item.Header>{post.title}</Item.Header>
                                    <Item.Meta>{post.date}</Item.Meta>
                                    <Item.Meta>{post.slug}</Item.Meta>
                                    <Item.Description>{post.body}</Item.Description>
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
        body
    }
  }
`;

export default graphql(allPosts)(withGlobalState(Blog));
