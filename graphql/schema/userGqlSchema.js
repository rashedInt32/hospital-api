import { User } from '../../models/userSchema';

const typeDef = `
  extend type Query {
    users: [User!]
  }

  type User {
    id: ID!,
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
  }
`

const resolvers = {
    users: async () => await User.find(),
}

export { typeDef, resolvers };
