import jwt from 'jsonwebtoken';
import { config } from '../config';

const verifyToken = async (req, res) => {
  const token = req.headers['x-auth-token'] || '';

  if (!token)
    return new Error('Access denied, no token provided');

  try {
    const decode = await jwt.verify(token, config.JWT_SECRET);
    req.user = decode;

    return req.user;

  } catch (ex) {
    return new Error('Invalid Token')
  }
}

export default verifyToken;
