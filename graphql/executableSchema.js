import { makeExecutableSchema } from 'apollo-server-express';
import { merge } from 'lodash';

import {
  typeDef as userQuery,
  resolvers as userResolvers,
  userMutation
} from "./schema/userGqlSchema";

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
  Query: merge(userResolvers),
  Mutation: merge(userMutation)
};

const rootQuery = makeExecutableSchema({
  typeDefs: [Query, userQuery],
  resolvers: merge(resolvers)
});

export default rootQuery;
