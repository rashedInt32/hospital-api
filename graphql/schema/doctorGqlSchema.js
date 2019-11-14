import gql from 'graphql-tag';
import { Doctor } from "../../models/doctorSchema";
import { User } from '../../models/userSchema';

const typeDef = gql`
  type Doctor {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
    hospital: String!
    specialties: [String]
    avatar: String
    availableDay: [String]
    phone: String
  }

  type doctorObject {
    doctor: Doctor!
  }

  extend type Query {
    doctors: [doctorObject!]
    doctor(id: ID!): Doctor!
  }
`;

const resolvers = {
  doctors: async () => {
    const doctors = await Doctor.find().populate({
      path: "doctor",
      model: User
    });

    return doctors;
  },
  doctor: async (_, { id }) => await Doctor.findById(id).populate()
};

export { typeDef, resolvers };
