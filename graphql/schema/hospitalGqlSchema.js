import { gql } from 'apollo-server-express';
import { Hospital, validateHospital } from '../../models/hospitalSchema';
import { union } from 'lodash';

const typeDef = gql`
  input CreateHospital {
    name: String!,
    location: String,
    logo: String,
    coverphoto: String,
    specialties: [String],
    doctors: [String]
  }

  input UpdateHospital {
    name: String,
    location: String,
    doctors: [String],
    specialties: [String]
  }

  type Hospital {
    id: ID!,
    name: String!,
    location: String,
    logo: String,
    coverphoto: String,
    specialties: [String],
    doctors: [String]
  }

  extend type Query {
    hospitals: [Hospital!]
    hospital(id: ID!): Hospital!
  }

  extend type Mutation {
    addHospital(hospital: CreateHospital!): Hospital
    updateHospital(id: ID!, update: UpdateHospital!): Hospital
  }
`;

const resolvers = {
  hospitals: async () => await Hospital.find(),
  hospital: async (_, { id }) =>
    await Hospital.findById(id),
}

const hospitalMutation = {
  async addHospital (_, args) {
    const { hospital } = args;

    const { error } = validateHospital(hospital);
    if (error)
      return new Error(error.details[0].message);

    let newHospital = new Hospital(hospital);
    await newHospital.save();

    return newHospital;
  },

  async updateHospital(_, args) {
    const { id, update } = args;
    let hospital = await Hospital.findById(id);

    hospital.set({
      name: update.name,
      location: update.location,
      specialties: union(hospital.specialties, update.specialties),
      doctos: union(hospital.doctors, update.doctors)
    });

    await hospital.save();

    return hospital;
  }
}

export { typeDef, resolvers, hospitalMutation };
