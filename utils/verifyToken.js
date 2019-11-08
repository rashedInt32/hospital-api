import jwt from 'jsonwebtoken';
import { config } from '../config';

const verifyToken = async (req, res) => {
  const token = req.headers['x-auth-token'] || '';

  console.log(res);

  if (req.body.operationName === 'LoginUser') return;

  if (!token)
    throw new Error("Access denied, no token provided");

  try {
    const decode = await jwt.verify(token, config.JWT_SECRET);

    return decode;

  } catch (ex) {
    throw new Error("Invalid Token");
  }
}

export default verifyToken;
