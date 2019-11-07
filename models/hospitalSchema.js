import mongoose from 'mongoose';
import Joi from 'joi';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  logo: String,
  coverphoto: String,
  specialties: [{type: String}],
  location: {
    type: String,
  },
})

const Hospital = mongoose.model('Hospital', hospitalSchema);

const validateHospital = (hospital) => {
  const schema = {
    name: Joi.string().required()
  }

  return Joi.validate(hospital, schema);
}

export { Hospital, validateHospital };
