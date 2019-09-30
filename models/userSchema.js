import mongoose from 'mongoose';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

import { config } from '../config';

const userSchema = new mongoose.Schema({
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
    ref: 'Hospital'
  }
});

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    role: this.role
  }, config.JWT_SECRET, {});
}

const User = mongoose.model('User', userSchema);

const userValidate = (user) => {
  const validateSchema = {
    firstName: Joi.string().min(5).max(50).required(),
    lastName: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    role: Joi.string().required(),
    hospital: Joi.string().required()
  }

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
