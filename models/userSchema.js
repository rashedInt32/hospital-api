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
    firstName: string().min(5).max(50).required(),
    lastName: string().min(5).max(50).required(),
    email: string().required().email(),
    password: string().min(5).max(1024).required(),
    role: string().required(),
  }

  return Joi.validate(user, validateSchema);
}

export { User, userValidate };
