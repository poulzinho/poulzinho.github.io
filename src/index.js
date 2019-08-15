import 'semantic-ui-less/semantic.less'
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from "react-router-dom";
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {ApolloProvider} from 'react-apollo'
import * as serviceWorker from './serviceWorker';
import './index.css';
import Layout from './components/Layout/'
import App from './App';
import Blog from './components/Blog/';
import Post from './components/Blog/Post';

const API = 'https://api-euwest.graphcms.com/v1/cjyt65lg3050801dj6cg05fx9/master';

const client = new ApolloClient({
    link: new HttpLink({uri: API}),
    cache: new InMemoryCache()
});

const routing = (
    <ApolloProvider client={client}>
        <Router>
            <Layout>
                <Route exact path="/" render={(props) => <App {...props}/>}/>
                <Route exact path="/blog" component={Blog}/>
                <Route path="/blog/post/:slug" component={Post}/>
            </Layout>
        </Router>
    </ApolloProvider>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
