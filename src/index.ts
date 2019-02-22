import { ApolloServer, gql } from 'apollo-server';

import { allEntries, getEntry, createEntry, updateEntry } from './data/entries';

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

const resolvers = {
  Query: {
    entries: (parent, args, context, info) => allEntries(),
    entry: (parent, { slug }, context, info) => getEntry(slug),
  },
  Mutation: {
    createEntry: (parent, args, context, info) => createEntry({ ...args.data }),
    updateEntry: (parent, { slug, data }, context, info) => updateEntry({ ...data, slug }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(process.env.PORT || 4001).then(({ url }) => {
  console.log(`✔ Server running on ${url}`);
});
