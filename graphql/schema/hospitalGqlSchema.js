import { gql } from "apollo-server-express";
import fg from 'fast-glob';
import { Hospital, validateHospital } from "../../models/hospitalSchema";
import { union, last } from "lodash";

import path from "path";
import { createWriteStream, unlinkSync } from "fs";

const typeDef = gql`
  scalar Upload
  input CreateHospital {
    name: String!
  }

  input UpdateHospital {
    id: ID!
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
    description: String
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
    singleUpload(file: Upload!, id: ID!, type: String!): File!
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
    let hospital = await Hospital.findByIdAndUpdate({ _id: id }, update);

    return hospital;
  },

  async singleUpload(_, { file, id, type }) {
    let { createReadStream, filename } = await file;

    // Find previous uploaded file in upload folder
    const files = await fg(`**/${id}.${type}.*.*`);
    // If present previous file, remove
    if (files.length > 0) {
      unlinkSync(path.join(__dirname, "../../", files[0]));
    }

    const fileRead = await createReadStream(file);

    // Renameing filename with id, type, and time
    const date = new Date();
    filename = filename.split('.');
    filename = `${id}.${type}.${date.getTime()}.${last(filename)}`;

    // Add filepath to upload folder
    const filePath = path.join(__dirname, "../../uploads", filename);

    // Writestream to the filepath
    const newfile = createWriteStream(filePath);
    // pipe new file with readStream
    await fileRead.pipe(newfile);

    return { filename };
  }
};

export { typeDef, resolvers, hospitalMutation };
