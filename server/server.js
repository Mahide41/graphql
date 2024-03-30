/**
 * Import required modules and dependencies
 */
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require("@apollo/server/express4");
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

/**
 * Async function to start the Apollo Server with Express integration
 */
async function startApolloServer() {
    /**
     * Initialize an Express application
     */
    const app = express();

    /**
     * Define GraphQL type definitions
     * Here we define the structure of User and Post types, and the available queries
     */
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

    /**
     * Define resolvers for the GraphQL server
     * Resolvers provide the logic to fetch the data for each type or query defined in typeDefs
     */
    const resolvers = {
        Query: {
            getPosts: () => axios.get('https://jsonplaceholder.typicode.com/posts').then(res => res.data),
            getUsers: () => axios.get('https://jsonplaceholder.typicode.com/users').then(res => res.data),
        },
    };

    /**
     * Initialize Apollo Server with type definitions and resolvers
     */
    const apolloServer = new ApolloServer({ typeDefs, resolvers });

    /**
     * Enable Cross-Origin Resource Sharing (CORS) for the Express app
     */
    app.use(cors());

    /**
     * Use bodyParser to parse incoming request bodies in a middleware before handlers,
     * available under req.body property
     */
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    /**
     * Start the Apollo Server
     */
    await apolloServer.start();

    /**
     * Apply Apollo middleware to the Express app on the '/graphql' route
     */
    app.use("/graphql", expressMiddleware(apolloServer));

    /**
     * Start the Express server on port 8000 and log the server start message
     */
    app.listen({ port: 8000 }, () => {
        console.log(`🚀 Server ready at http://localhost:8000/graphql`);
    });
}

/**
 * Call the function to start the Apollo server with Express integration
 */
startApolloServer();