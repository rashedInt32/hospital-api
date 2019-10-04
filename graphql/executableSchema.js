import { makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';

import {
  typeDef as userQuery,
  resolvers as userResolvers,
  userMutation
} from "./schema/userGqlSchema";

import {
  typeDef as hospitalQuery,
  resolvers as hospitalResolvers,
  hospitalMutation
} from "./schema/hospitalGqlSchema";

const Query = `
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  schema {
    query: Query,
    mutation: Mutation
  }

`;

const resolvers = {
  Query: merge(userResolvers, hospitalResolvers),
  Mutation: merge(userMutation, hospitalMutation)
};

const rootQuery = makeExecutableSchema({
  typeDefs: [Query, userQuery, hospitalQuery],
  resolvers: merge(resolvers),
});

export default rootQuery;
