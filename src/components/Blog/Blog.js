import React from 'react'
import {graphql} from 'react-apollo';
import gql from 'graphql-tag';

class Blog extends React.Component {

    postPath = '/blog/post/';

    goToPost = (slug) => {
        this.props.history.push(`${this.postPath}${slug}`);
    };

    render() {
        const data = this.props.data;
        if (data.loading) {
            return <div>Loading blog...</div>
        } else {
            return <div>
                <div>All entries</div>
                <div>{
                    data.posts.map((post, i) =>
                        <div key={i} onClick={() => this.goToPost(post.slug)}>{JSON.stringify(post)}</div>
                    )
                }
                </div>
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

export default graphql(allPosts)(Blog);
