import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Gist from 'react-gist'
import Markdown from 'markdown-to-jsx'

const GistHandler = (props) => {
    if (props.src && props.src.includes('gist.github.com')) {
        return <Gist id={props.src.split('/')[4].split('.')[0]}/>
    }
    return null;
};

const Post = ({ data: { loading, post } }) => {

    if(loading) {
        return <h2>Loading article...</h2>
    }
    else {
        if (post) {
            return (
                <article className="wrapper">
                    <div className="post">
                        <h1>{post.title}</h1>

                        <Markdown options={{
                            overrides: {
                                script: {
                                    component: GistHandler
                                },
                                Gist: Gist,
                            },
                        }}
                        >
                            {post.markdown}
                        </Markdown>
                    </div>
                </article>
            );
        }
        else {
            return <div>Article not found!</div>
        }
    }
};

const singlePost = gql`
 query singlePost($slug: String!) {
  post(where: {slug: $slug}) {
        status
        updatedAt
        createdAt
        id
        slug
        date
        title
        image
        summary
        markdown
   }
 }
`;
export default graphql(singlePost, {
    options: ({ match }) => ({
        variables: {
            slug: match.params.slug
        }
    })
})(Post);