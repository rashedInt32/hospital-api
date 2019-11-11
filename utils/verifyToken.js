import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { config } from '../config';
import { ignoreMutation, ignoreQuery } from './ignoreContext';

const verifyToken = async (req, res) => {
  const token = req.headers['x-auth-token'] || '';

  const isNamedQuery = _.last(req.headers.referer.split('/'));

  const isIgnoredQuery = _.includes(ignoreQuery, isNamedQuery)

  const isIgnoredMutation = _.includes(ignoreMutation, req.body.operationName)

  if (isIgnoredMutation || isIgnoredQuery) return;

  if (!token)
    throw new Error("Access denied, no token provided");

  try {
    const decode = jwt.verify(token, config.JWT_SECRET);

    return decode;

  } catch (ex) {
    throw new Error("Invalid Token");
  }
}

export default verifyToken;
