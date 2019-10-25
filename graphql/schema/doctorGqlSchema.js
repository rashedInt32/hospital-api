import { gql } from 'apollo-server-express';
import { Doctor } from "../../models/doctorSchema";
import { User } from '../../models/userSchema';

const typeDef = gql`
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
`;

const resolvers = {
  doctors: async () => await Doctor.find().populate({
    path: 'doctor',
    model: User
  }),
  doctor: async (_, { id }) => await Doctor.findById(id).populate()
};

export { typeDef, resolvers };
