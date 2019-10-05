import { gql } from "apollo-server-express";
import { Hospital, validateHospital } from "../../models/hospitalSchema";
import { union, last } from "lodash";

import path from "path";
import { createWriteStream } from "fs";

const typeDef = gql`
  scalar Upload
  input CreateHospital {
    name: String!
  }

  input UpdateHospital {
    name: String
    location: String
    description: String
    doctors: [String]
    specialties: [String]
    logo: String
    coverphoto: String
  }

  type Hospital {
    id: ID!
    name: String!
    location: String
    logo: String
    coverphoto: String
    specialties: [String]
    doctors: [String]
  }

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Query {
    hospitals: [Hospital!]
    hospital(id: ID!): Hospital!
    uploads: [File]
  }

  extend type Mutation {
    addHospital(hospital: CreateHospital!): Hospital
    updateHospital(id: ID!, update: UpdateHospital!): Hospital
    singleUpload(file: Upload!): File!
  }
`;

const resolvers = {
  hospitals: async (_, args, context) => {
    if (context.role !== "superadmin")
      return new Error("You don't have permission");
    return await Hospital.find();
  },
  hospital: async (_, { id }) => await Hospital.findById(id),

  uploads: () => {}
};

const hospitalMutation = {
  async addHospital(_, args) {
    const { hospital } = args;

    const { error } = validateHospital(hospital);
    if (error) return new Error(error.details[0].message);

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
  },

  async singleUpload(_, { file }) {
    const { createReadStream, filename, mimetype, encoding } = await file;

    const fileRead = await createReadStream(file);

    let renameFile = filename.split('.');
    renameFile = 'name.' + last(renameFile);

    const newfile = createWriteStream(
      path.join(__dirname, "../../uploads", filename)
    );
    await fileRead.pipe(newfile);

    return { filename, mimetype, encoding };
  }
};

export { typeDef, resolvers, hospitalMutation };
