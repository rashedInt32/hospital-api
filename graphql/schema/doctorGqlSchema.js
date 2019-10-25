import bcrypt from "bcryptjs";
import { gql } from 'apollo-server-express';
import { Doctor, doctorValidate, authValidate } from "../../models/doctorSchema";

const typeDef = gql`
  input CreateDoctor {
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
    hospital: ID!
  }
  input UpdateDoctor {
    id: ID!,
    firstName: String,
    lastName: String,
    email: String,
    role: String
    password: String
    hospital: ID
    specialties: [String]
    avatar: String
    availableDay: [String]
    phone: String
  }
  type Doctor {
    id: ID!,
    firstName: String!,
    lastName: String!,
    email: String!,
    role: String!
    password: String!
    hospital: String!
    specialties: [String]
    avatar: String
    availableDay: [String]
    phone: String
  }

  extend type Query {
    doctors: [Doctor!]
    doctor(id: ID!): Doctor!
  }

  extend type Mutation {
    addDoctor(userInput: CreateDoctor!): String!
    authDoctor(email: String!, password: String!): String!
    updateDoctor(userInput: UpdateUser!): Doctor!
  }
`;

const resolvers = {
  doctors: async () => await Doctor.find(),
  doctor: async (_, { id }) => await Doctor.findById(id)
};

const doctorMutation = {
  async addDoctor(_, args) {
    const { userInput } = args;

    const { error } = doctorValidate(userInput);
    if (error !== null) return new Error(error.details[0].message);

    let user = await Doctor.find({ email: userInput.email });
    if (user.length > 0) return new Error("Email alread exist.");

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(userInput.password, salt);
    userInput.password = hashed;

    user = new Doctor(userInput);
    await user.save();

    const token = user.generateAuthToken();
    return token;
  },

  async authDoctor(_, args) {
    const { email, password } = args;

    const { error } = authValidate(args);
    if (error) return new Error(error.details[0].message);

    let user = await Doctor.findOne({ email });
    if (!user) return new Error("Email not found");

    let isPasswordMatch = bcrypt.compareSync(password, user.password);
    if (!isPasswordMatch) return new Error("Password not match");

    const token = user.generateAuthToken();
    return token;
  },

  async updateUser(_, args) {
    let { userInput } = args;

    const user = await Doctor.findById(userInput.id);

    if (userInput.password !== user.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(userInput.password, salt);
      userInput.password = hash;
    }

    const updateUser = await Doctor.findByIdAndUpdate(userInput.id, userInput);
    return updateUser;
  }
};

export { typeDef, resolvers, doctorMutation };
