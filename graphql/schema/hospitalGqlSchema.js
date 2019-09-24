import { Hospital } from '../../models/hospitalSchema';

const typeDef = `
  input CreateHospital {
    name: String!,
    location: String!,
    logo: String,
    coverphoto: String,
    specialties: [String],
    doctors: [String]
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
  }
}

export { typeDef, resolvers, hospitalMutation };
