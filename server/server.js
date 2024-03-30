const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require("@apollo/server/express4");
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

async function startApolloServer() {
    // Express app setup
    const app = express();
    // Apollo Server setup
    const typeDefs = `
type User {
    id: ID!
    name: String!
    email: String!
    username: String!
}

type Post {
    id: ID!
    title: String!
    body: String!
    user: User!
}

type Query {
    getPosts: [Post]
    getUsers: [User]
}
`;

    const resolvers = {
        Query: {
            getPosts: () => axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data),
            getUsers: () => axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data),
        },
    };

    const apolloServer = new ApolloServer({ typeDefs, resolvers });

    app.use(cors());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    await apolloServer.start();

    app.use("/graphql", expressMiddleware(apolloServer));

    app.listen({ port: 8000 }, () => {
        console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    });
}

startApolloServer();
