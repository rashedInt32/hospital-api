import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { config } from '../config';

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    minlength: 3,
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
    ref: 'Hospital'
  },
  pending: {
    type: Boolean,
    default: true
  },
  avatar: String,
  specialties: [{type: String}],
  availableDays: [{type: String}],
  phone: String,
  bio: String
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role,
    hospital: this.hospital,
    pending: this.pending,
    avatar: this.avatar
  }, config.JWT_SECRET, {});
}

const User = mongoose.model('User', userSchema);

const userValidate = (user) => {
  const validateSchema = {
    id: Joi.string(),
    firstName: Joi.string()
      .min(3)
      .max(50)
      .required(),
    lastName: Joi.string()
      .min(3)
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
    hospital: user.role !== 'superadmin' ? Joi.string().required() : Joi.string().allow(null),
    pending: Joi.boolean(),
    avatar: Joi.string().allow(null),
    bio: Joi.string().allow(null),
    specialties: Joi.array(),
    availableDays: Joi.array(),
    phone: Joi.string().allow(null)
  };

  return Joi.validate(user, validateSchema);
}

const authValidate = user => {
  const validateSchema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .required(),
  };

  return Joi.validate(user, validateSchema);
};


export { User, userValidate, authValidate };
