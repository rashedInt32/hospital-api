import { makeExecutableSchema } from "apollo-server-express";
import { merge } from "lodash";
import gql from 'graphql-tag';

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

import {
  typeDef as doctorQuery,
  resolvers as doctorResolvers,
} from "./schema/doctorGqlSchema";

const Query = gql`
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
  Query: merge(userResolvers, hospitalResolvers, doctorResolvers),
  Mutation: merge(userMutation, hospitalMutation)
};

const rootQuery = makeExecutableSchema({
  typeDefs: [Query, userQuery, hospitalQuery, doctorQuery],
  resolvers: merge(resolvers)
});

export default rootQuery;
