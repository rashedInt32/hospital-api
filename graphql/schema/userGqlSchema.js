import bcrypt from 'bcryptjs';
import gql from 'graphql-tag';
import { User, userValidate, authValidate } from "../../models/userSchema";
import { Doctor } from '../../models/doctorSchema';
import { Hospital } from "../../models/hospitalSchema";

const typeDef = gql`
  input CreateUser {
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
    hospital: ID!
    pending: Boolean
  }
  input UpdateUser {
    id: ID!,
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String
    password: String
    hospital: ID
    pending: Boolean,
    avatar: String
    specialties: [String],
    availableDays: [String],
    phone: String,
    bio: String
  }
  type User {
    id: ID!,
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
    hospital: String
    pending: Boolean,
    avatar: String
    specialties: [String],
    availableDays: [String],
    phone: String
    bio: String
  }

  extend type Query {
    users: [User!]
    user(id: ID!): User!
  }

  extend type Mutation {
    addUser(userInput: CreateUser!): String!
    authUser(email: String!, password: String!): String!
    updateUser(userInput: UpdateUser!): User!
    removeUser(id: ID!): String!
  }
`;

const resolvers = {
  users: async () => await User.find(),
  user: async (_, {id}) => await User.findById(id),
};

const userMutation = {
  async addUser(_, args) {
    const { userInput } = args;

    const { error } = userValidate(userInput);
    if (error !==null) return new Error(error.details[0].message);

    let user = await User.find({ email: userInput.email });
    if (user.length > 0)
      return new Error("Email alread exist.");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userInput.password, salt);
    userInput.password = hashed;

    user = new User(userInput);
    await user.save();

    if (user.role === 'doctor') {
      Doctor.create({doctor: user._id});
      let hospital = await Hospital.findById(user.hospital);
      hospital.doctors = [...hospital.doctors, user._id];
      hospital.save();
    }

    const token = user.generateAuthToken();
    return token;
  },

  async authUser(_, args) {
    const { email, password } = args;

    const { error } = authValidate(args);
    if (error) return new Error(error.details[0].message);

    let user = await User.findOne({ email });
    if (!user)
      return new Error('Email not found');

    let isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch)
      return new Error("Password not match");

    const token = user.generateAuthToken();
    return token;
  },

  async updateUser(_, args) {
    let { userInput } = args;
    const { error } = userValidate(userInput);
    if (error !==null) return new Error(error.details[0].message);

    const user = await User.findById(userInput.id);

    if (userInput.password !== user.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(userInput.password, salt);
      userInput.password = hash;
    }


    const updateUser = await User.findByIdAndUpdate(userInput.id, userInput);
    return updateUser;
  },

  async removeUser(_, {id}) {
    await User.findByIdAndRemove(id);
    return "User remove successfully";
  }

}

export { typeDef, resolvers, userMutation };
