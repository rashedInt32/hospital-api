import { gql } from 'apollo-server-express';
import { Hospital } from '../../models/hospitalSchema';

const typeDef = gql`
  input CreateHospital {
    name: String!,
    location: String!,
    logo: String,
    coverphoto: String,
    specialties: [String],
    doctors: [String]
  }

  input UpdateHospital {
    name: String,
    location: String,
    #doctors: [String],
    specialties: [String]
  }

  type Hospital {
    id: ID!,
    name: String!,
    location: String!,
    logo: String,
    coverphoto: String,
    specialties: [String],
    doctors: [String]
  }

  extend type Query {
    hospitals: [Hospital!]
  }

  extend type Mutation {
    addHospital(hospitalInput: CreateHospital!): Hospital
    updateHospital(id: ID!, update: UpdateHospital!): Hospital
  }
`;

const resolvers = {
  hospitals: async () => await Hospital.find(),
}

const hospitalMutation = {
  addHospital: async (_, args) => {
    const { hospitalInput } = args;
    let hospital = new Hospital(hospitalInput);
    await hospital.save();

    return hospital;
  },

  updateHospital: async (_, args) => {
    const { id, update } = args;
    let hospital = await Hospital.findById(id);

    hospital.set({
      name: update.name,
      location: update.location,
      specialties: hospital.specialties.concat(update.specialties),
    });

    await hospital.save();

    return hospital;
  }
}

export { typeDef, resolvers, hospitalMutation };
