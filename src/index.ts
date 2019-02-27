require('dotenv').config();
import { ApolloServer, gql } from 'apollo-server';

import { allEntries, getEntry, createEntry, updateEntry } from './data/entries';
// import { allEntries, getEntry, createEntry, updateEntry } from './data/entries-dropbox';

// Define all of the graphql types
// In a larger project, this should probably be broken out into its own file.
const typeDefs = gql`
  type Entry {
    title: String!
    author: String!
    body: String!
    slug: String! # Acts as ID; Uniqueness enforced by filename.
  }

  type Query {
    entries: [Entry!]!
    entry(slug: String!): Entry!
  }

  type Mutation {
    createEntry(data: CreateEntryInput!): Entry!
    updateEntry(slug: String!, data: UpdateEntryInput!): Entry!
  }

  input CreateEntryInput {
    title: String!
    body: String!
    author: String!
    slug: String!
  }

  input UpdateEntryInput {
    title: String
    body: String
    author: String
  }
`;

// Define all of the GraphQL Resolvers (How GraphQL "Resolves" certain queries and mutations)
const resolvers = {
  // Queries handle the fetching of data. You can typically think of these as your 'GET' requests in a typical REST API
  // If what you want to do is just querying data and has no side effects, it should likely be a query
  Query: {
    entries: (parent, args, context, info) => allEntries(),
    entry: (parent, { slug }, context, info) => getEntry(slug),
  },

  // Mutations handle, as their name suggests, the mutation of data. You can think of these as your POST/PUT/PATCH/DELETE requests in a typical REST API.
  // Typically, if what you want to do has a side effect it should probably be a mutation
  Mutation: {
    createEntry: (parent, args, context, info) => createEntry({ ...args.data }),
    updateEntry: (parent, { slug, data }, context, info) => updateEntry({ ...data, slug }),
  },
};

// Set up the Apollo Server and run it on $PORT or 4001 if the environment variable is not defined.

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(process.env.PORT || 4001).then(({ url }) => {
  console.log(`✔ Server running on ${url}`);
});
