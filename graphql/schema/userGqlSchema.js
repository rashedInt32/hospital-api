import bcrypt from 'bcryptjs';
import { ApolloError } from 'apollo-server-express';
import { User } from '../../models/userSchema';

const typeDef = `
  input CreateUser {
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
  }
  type User {
    id: ID!,
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
  }

  extend type Query {
    users: [User!]
  }

  extend type Mutation {
    addUser(userInput: CreateUser!): User!
  }
`

const resolvers = {
  users: async () => await User.find(),
};

const userMutation = {
  async addUser(_, args) {
    const { userInput } = args;

    let user = await User.find({ email: userInput.email });
    if (user.length > 0)
      return new Error("Email alread exist.");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userInput.password, salt);
    userInput.password = hashed;

    user = new User(userInput);

    await user.save();

    return user;
  }
}

export { typeDef, resolvers, userMutation };
