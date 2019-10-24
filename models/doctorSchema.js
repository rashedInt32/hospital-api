import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  role: {
    type: String,
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hospital"
  },
  avatar: String,
  specialties: [{type: String}],
  availableDays: [{type: String}],
  phone: {type: String, required: true}
});

doctorSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    {
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      role: this.role,
      hospital: this.hospital,
      avatar: this.avatar
    },
    config.JWT_SECRET,
    {}
  );
};

const Doctor = mongoose.model("Doctor", doctorSchema);

const doctorValidate = doctor => {
  const validateSchema = {
    firstName: Joi.string()
      .min(5)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(50)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(1024)
      .required(),
    role: Joi.string().required(),
    hospital: Joi.string().required(),
    avatar: Joi.string(),
    specialties: Joi.array(),
    availableDays: Joi.array(),
    phone: Joi.string().required()
  };

  return Joi.validate(doctor, validateSchema);
};

const authValidate = doctor => {
  const validateSchema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string().required()
  };

  return Joi.validate(doctor, validateSchema);
};

export { Doctor, doctorValidate, authValidate };
