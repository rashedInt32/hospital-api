import mongoose from 'mongoose';

export const db = {
  connect: async (dbUri, options) => {
    const success = await mongoose.connect(dbUri, options);
    if (success === mongoose) {
      console.log('DB connected successfully');
      return success;
    }

    console.log('DB connection failes');
  }
};
