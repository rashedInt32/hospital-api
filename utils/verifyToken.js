import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { config } from '../config';
import { ignoreProtectedUrl } from "./ignoreContext";

const verifyToken = async (req, res) => {
  const token = req.headers['x-auth-token'] || '';

  const protectedUrl = _.last(req.headers.referer.split('/'));

  const shouldIgnoredUrlWithoutAuth = _.includes(ignoreProtectedUrl, protectedUrl);

  if (shouldIgnoredUrlWithoutAuth) {
    if (!token) throw new Error("Access denied, no token provided");

    try {
      const decode = jwt.verify(token, config.JWT_SECRET);

      return decode;
    } catch (ex) {
      throw new Error("Invalid Token");
    }
  }
  return;
}

export default verifyToken;
