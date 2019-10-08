import { gql } from "apollo-server-express";
import glob from 'glob';
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
    let hospital = await Hospital.findById(id);

    hospital.set({
      name: update.name,
      location: update.location,
      specialties: union(hospital.specialties, update.specialties),
      doctos: union(hospital.doctors, update.doctors),
      coverphoto: update.coverphoto
    });

    await hospital.save();

    return hospital;
  },

  async singleUpload(_, { file, id, type }) {
    let { createReadStream, filename } = await file;

    const previousUploadFile = glob(`**/${id}.${type}.*.*` , {}, function (er, files) {
      unlinkSync(path.join(__dirname, "../../", files[0]));

    });

    const fileRead = await createReadStream(file);




    //unlinkSync(path.join(__dirname, "../../uploads", previousUploadFile));


    const date = new Date();

    filename = filename.split('.');
    filename = `${id}.${type}.${date.getTime()}.${last(filename)}`;

    const filePath = path.join(__dirname, "../../uploads", filename);

    const newfile = createWriteStream(filePath);

    await fileRead.pipe(newfile);

    console.log(filename);

    return { filename };
  }
};

export { typeDef, resolvers, hospitalMutation };
